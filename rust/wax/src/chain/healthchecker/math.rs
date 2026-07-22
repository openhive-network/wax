//! Endpoint scoring: converts the accumulated probe history into a
//! normalized, best-first scoreboard.

use super::endpoint::{ErrorReason, ProbeState};
use super::scored_endpoint::{ScoredEndpoint, ScoredState};

/// Used to turn a down probe into a synthetic latency: a URL's down samples
/// enter the score as this multiple of the highest observed latency, so a
/// flaky URL ranks below a consistently slow one.
const PENALTY_MULTIPLIER: f64 = 1.2;

/// Used to weight the connection-stability penalty: the final score blends
/// the scaled median latency and the coefficient of variation of the
/// latencies at a `1 - x` / `x` ratio.
const CONNECTION_ISSUES_MULTIPLIER: f64 = 0.2;

/// Calculates the default scoreboard from the per-URL probe history: up
/// URLs sorted best-first with a score normalized into `0.1..=1.0` (the
/// best one always scores `1.0`), followed by the down URLs.
///
/// Every down sample in a URL's history enters the calculation as a
/// synthetic latency of [`PENALTY_MULTIPLIER`] × the highest observed
/// latency. A URL's raw score is the median of those latencies (robust
/// against a single spike) blended with the coefficient of variation of the
/// latencies ([`CONNECTION_ISSUES_MULTIPLIER`]) penalizing jitter.
pub fn default_calc_scores(
    data: &[(String, Vec<ProbeState>)],
) -> Vec<ScoredEndpoint> {
    let Some(max_latency) = max_up_latency(data) else {
        return Vec::new();
    };

    if max_latency == 0 {
        return list_all_down(data);
    }

    let penalty_ms = max_latency as f64 * PENALTY_MULTIPLIER;
    let (mut raw_up, down) = bucket_urls(data, penalty_ms);

    blend_jitter_penalty(&mut raw_up);

    let mut result = normalize_best_first(raw_up);
    result.extend(down);

    result
}

/// Represents an up URL mid-calculation: its raw median score (later the
/// blended value) and the coefficient of variation of its penalized
/// latencies.
struct RawUpScore {
    url: String,
    score: f64,
    latencies: Vec<u64>,
    coef: f64,
}

/// Calculates the highest latency among all up probes; `None` when no probe
/// was up at all.
fn max_up_latency(data: &[(String, Vec<ProbeState>)]) -> Option<u64> {
    data.iter()
        .flat_map(|(_, history)| history)
        .filter_map(|entry| match entry {
            ProbeState::Up { latency } => Some(*latency),
            ProbeState::Down { .. } => None,
        })
        .max()
}

/// Converts every URL into a down entry carrying its newest failure reason.
fn list_all_down(data: &[(String, Vec<ProbeState>)]) -> Vec<ScoredEndpoint> {
    data.iter()
        .filter(|(_, history)| !history.is_empty())
        .map(|(url, history)| ScoredEndpoint {
            url: url.clone(),
            state: ScoredState::Down {
                last_error_reason: last_error_reason(history),
            },
        })
        .collect()
}

/// Splits the URLs into the up bucket — carrying the raw median score and
/// the jitter coefficient — and the down bucket of URLs that were never up,
/// skipping empty histories.
fn bucket_urls(
    data: &[(String, Vec<ProbeState>)],
    penalty_ms: f64,
) -> (Vec<RawUpScore>, Vec<ScoredEndpoint>) {
    let mut up = Vec::new();
    let mut down = Vec::new();

    for (url, history) in data {
        if history.is_empty() {
            continue;
        }

        let latencies = up_latencies(history);
        if latencies.is_empty() {
            down.push(ScoredEndpoint {
                url: url.clone(),
                state: ScoredState::Down {
                    last_error_reason: last_error_reason(history),
                },
            });

            continue;
        }

        let penalized = penalized_latencies(history, penalty_ms);
        up.push(RawUpScore {
            url: url.clone(),
            coef: coef(&penalized),
            score: median(penalized),
            latencies,
        });
    }

    (up, down)
}

/// Extracts the raw latencies of the up probes, newest last.
fn up_latencies(history: &[ProbeState]) -> Vec<u64> {
    history
        .iter()
        .filter_map(|entry| match entry {
            ProbeState::Up { latency } => Some(*latency),
            ProbeState::Down { .. } => None,
        })
        .collect()
}

/// Converts a probe history into the latencies entering the score: an up
/// sample contributes its latency, a down sample the synthetic penalty.
fn penalized_latencies(history: &[ProbeState], penalty_ms: f64) -> Vec<f64> {
    history
        .iter()
        .map(|entry| match entry {
            ProbeState::Up { latency } => *latency as f64,
            ProbeState::Down { .. } => penalty_ms,
        })
        .collect()
}

/// Returns the failure reason of the newest sample; [`ErrorReason::Other`]
/// when that sample is an up one.
fn last_error_reason(history: &[ProbeState]) -> ErrorReason {
    match history.last() {
        Some(ProbeState::Down { reason }) => *reason,
        _ => ErrorReason::Other,
    }
}

/// Converts each raw median score into the blended one: the median scaled
/// into `0..=100` across all up URLs, weighted against the jitter
/// coefficient by [`CONNECTION_ISSUES_MULTIPLIER`].
fn blend_jitter_penalty(raw_up: &mut [RawUpScore]) {
    let medians = raw_up.iter().map(|raw| raw.score);
    let min_median = medians.clone().fold(f64::MAX, f64::min);
    let max_median = medians.fold(0.0, f64::max);

    for raw in raw_up {
        raw.score = scale(raw.score, min_median, max_median, 0.0, 100.0)
            * (1.0 - CONNECTION_ISSUES_MULTIPLIER)
            + raw.coef * 100.0 * CONNECTION_ISSUES_MULTIPLIER;
    }
}

/// Sorts the blended scores ascending and inverts them into the final
/// best-first `0.1..=1.0` range, the best URL scoring exactly `1.0`.
fn normalize_best_first(mut raw_up: Vec<RawUpScore>) -> Vec<ScoredEndpoint> {
    raw_up.sort_by(|a, b| a.score.total_cmp(&b.score));

    // Non-empty: the caller only reaches this with at least one up URL.
    let min = raw_up[0].score;
    let max = raw_up[raw_up.len() - 1].score;

    raw_up
        .into_iter()
        .map(|raw| ScoredEndpoint {
            url: raw.url,
            state: ScoredState::Up {
                score: 1.1 - scale(raw.score, min, max, 0.1, 1.0),
                latencies: raw.latencies,
            },
        })
        .collect()
}

/// Converts `input` from the `[y_min, y_max]` range into the
/// `[x_min, x_max]` range; a collapsed input range divides by `1` instead
/// (mapping everything to `x_min`), like the TS `|| 1` guard.
fn scale(input: f64, y_min: f64, y_max: f64, x_min: f64, x_max: f64) -> f64 {
    let denominator = if y_max - y_min == 0.0 {
        1.0
    } else {
        y_max - y_min
    };

    (input - y_min) / denominator * (x_max - x_min) + x_min
}

/// Calculates the arithmetic mean.
fn avg(values: &[f64]) -> f64 {
    values.iter().sum::<f64>() / values.len() as f64
}

/// Calculates the median, averaging the two middle values for an
/// even-sized input.
fn median(mut values: Vec<f64>) -> f64 {
    values.sort_by(f64::total_cmp);
    let mid = values.len() / 2;

    if values.len() % 2 == 0 {
        (values[mid - 1] + values[mid]) / 2.0
    } else {
        values[mid]
    }
}

/// Calculates the population standard deviation; `0` for fewer than two
/// values.
fn standard_deviation(values: &[f64]) -> f64 {
    if values.len() < 2 {
        return 0.0;
    }

    let average = avg(values);
    let squared_deviations: Vec<f64> = values
        .iter()
        .map(|value| (value - average).powi(2))
        .collect();

    avg(&squared_deviations).sqrt()
}

/// Calculates the coefficient of variation (standard deviation over mean);
/// `0` for fewer than two values or a zero mean.
fn coef(values: &[f64]) -> f64 {
    if values.len() < 2 {
        return 0.0;
    }

    let average = avg(values);
    if average == 0.0 {
        return 0.0;
    }

    standard_deviation(values) / average
}

#[cfg(test)]
mod tests {
    use super::*;

    fn up(latency: u64) -> ProbeState {
        ProbeState::Up { latency }
    }

    fn down(reason: ErrorReason) -> ProbeState {
        ProbeState::Down { reason }
    }

    fn entry(url: &str, history: Vec<ProbeState>) -> (String, Vec<ProbeState>) {
        (url.to_string(), history)
    }

    fn assert_score(scored: &ScoredEndpoint, url: &str, score: f64) {
        assert_eq!(scored.url, url);
        match &scored.state {
            ScoredState::Up { score: actual, .. } => {
                assert!(
                    (actual - score).abs() < 1e-9,
                    "expected score {score} for {url}, got {actual}"
                );
            }
            ScoredState::Down { .. } => panic!("{url} must be scored as up"),
        }
    }

    #[test]
    fn returns_empty_without_any_up_probe() {
        assert!(default_calc_scores(&[]).is_empty());
        assert!(
            default_calc_scores(&[entry(
                "a",
                vec![down(ErrorReason::Timeout)]
            )])
            .is_empty()
        );
    }

    // A single up URL always normalizes to the maximum score.
    #[test]
    fn scores_single_up_url_at_maximum() {
        let scored =
            default_calc_scores(&[entry("https://a", vec![up(100), up(150)])]);

        assert_eq!(scored.len(), 1);
        assert_score(&scored[0], "https://a", 1.0);
        assert!(matches!(
            &scored[0].state,
            ScoredState::Up { latencies, .. } if latencies == &[100, 150]
        ));
    }

    // Expected values cross-checked against the TS `defaultCalcScores`
    // (node run): fast 1.0, slow 0.1 — the normalized range endpoints.
    #[test]
    fn ranks_lower_latency_first() {
        let scored = default_calc_scores(&[
            entry("https://slow", vec![up(200), up(200)]),
            entry("https://fast", vec![up(50), up(50)]),
        ]);

        assert_eq!(scored.len(), 2);
        assert_score(&scored[0], "https://fast", 1.0);
        assert_score(&scored[1], "https://slow", 0.1);
    }

    // The down sample enters as a synthetic 120ms latency (1.2 × max) and
    // its jitter is penalized through the coefficient of variation, so the
    // stable URL must win despite equal median up-latencies.
    #[test]
    fn penalizes_downtime_and_jitter() {
        let scored = default_calc_scores(&[
            entry(
                "https://flaky",
                vec![down(ErrorReason::Timeout), up(100), up(100)],
            ),
            entry("https://stable", vec![up(100), up(100), up(100)]),
        ]);

        assert_eq!(scored.len(), 2);
        assert_score(&scored[0], "https://stable", 1.0);
        assert_score(&scored[1], "https://flaky", 0.1);
    }

    #[test]
    fn lists_never_up_urls_after_up_ones_with_newest_reason() {
        let scored = default_calc_scores(&[
            entry(
                "https://dead",
                vec![
                    down(ErrorReason::ServerError),
                    down(ErrorReason::Timeout),
                ],
            ),
            entry("https://alive", vec![up(100)]),
        ]);

        assert_eq!(scored.len(), 2);
        assert_score(&scored[0], "https://alive", 1.0);
        assert!(matches!(
            &scored[1],
            ScoredEndpoint {
                url,
                state: ScoredState::Down {
                    last_error_reason: ErrorReason::Timeout
                },
            } if url == "https://dead"
        ));
    }

    // Documents the TS quirk: up probes with all-zero latencies degrade
    // every URL to down (an up newest sample reads as `Other`).
    #[test]
    fn lists_everything_down_on_all_zero_latencies() {
        let scored = default_calc_scores(&[
            entry("https://zero", vec![up(0)]),
            entry("https://dead", vec![down(ErrorReason::Timeout)]),
        ]);

        assert_eq!(scored.len(), 2);
        assert!(matches!(
            &scored[0],
            ScoredEndpoint {
                url,
                state: ScoredState::Down {
                    last_error_reason: ErrorReason::Other
                },
            } if url == "https://zero"
        ));
        assert!(matches!(
            &scored[1],
            ScoredEndpoint {
                url,
                state: ScoredState::Down {
                    last_error_reason: ErrorReason::Timeout
                },
            } if url == "https://dead"
        ));
    }

    #[test]
    fn averages_middle_values_of_even_sized_input() {
        assert_eq!(median(vec![3.0, 1.0, 10.0, 2.0]), 2.5);
        assert_eq!(median(vec![3.0, 1.0, 2.0]), 2.0);
    }

    #[test]
    fn reports_no_variation_for_short_or_zero_mean_input() {
        assert_eq!(coef(&[100.0]), 0.0);
        assert_eq!(coef(&[0.0, 0.0]), 0.0);
    }
}
