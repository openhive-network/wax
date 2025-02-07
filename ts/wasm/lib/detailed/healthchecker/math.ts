import type { THiveEndpointData, IHiveEndpointDataDown } from "./endpoint.js";
import type { IScoredEndpointDown, IScoredEndpointUp, TCalculateScoresFunction, TScoredEndpoint } from "./healthchecker.js";

// Utility math functions:
const scale = (inputY: number, yMin: number, yMax: number, xMin: number, xMax: number): number => ((inputY - yMin) / ((yMax - yMin) || 1)) * (xMax - xMin) + xMin;
const avg = (arr: number[]): number => arr.reduce((a, b) => a + b, 0) / arr.length;
const median = (arr: number[]): number => {
  arr = arr.sort((a, b) => a - b);
  if (arr.length % 2 === 0)
    return (arr[(arr.length / 2) - 1] + arr[arr.length / 2]) / 2;
  else
    return arr[(arr.length - 1) / 2];
};
const standardDeviation = (arr: number[]): number => {
  if (arr.length < 2)
    return 0;

  const averageValue = avg(arr);

  return Math.sqrt(avg(arr.map(x => Math.pow(x - averageValue, 2))));
};

const PENALTY_MULTIPLIER = 1.2;

export const defaultCalcScores: TCalculateScoresFunction = (data: Readonly<Array<[string, Array<THiveEndpointData>]>>): Array<TScoredEndpoint> => {
  // Calculate For endpoint down penalty
  const maxLatency = data.map(value => value[1]).reduce((prev, curr) => {
    const max = curr.reduce((prev, curr) => curr.up ? (curr.latency > prev ? curr.latency : prev) : prev, 0);
    return max > prev ? max : prev;
  }, 0);

  // No up times at all - return all endpoints as down and skip all the redundant calculation
  if (maxLatency === 0)
    return data.map(([endpointUrl, endpointData]) => ({
      endpointUrl,
      score: 0,
      up: false,
      lastErrorReason: (endpointData[endpointData.length - 1] as IHiveEndpointDataDown).reason || 'other'
    }));

  // Apply penalty for down times
  const penaltyMs = maxLatency * PENALTY_MULTIPLIER;

  const resultsUp: Array<IScoredEndpointUp> = [];
  const resultsDown: Array<IScoredEndpointDown> = [];

  for(const [endpointUrl, endpointData] of data) {
    // Skip endpoints with no data yet
    if (endpointData.length === 0)
      continue;

    // Rewrite latencies applying penalty for down times
    const latenciesForCalculation = endpointData.map(value => value.up ? value.latency : penaltyMs);

    // Get amount of times endpoint was up
    const timesUp = endpointData.filter(value => value.up).length;

    // If endpoint was down all the time, add it to down results
    if (timesUp === 0) {
      resultsDown.push({
        endpointUrl,
        score: 0,
        up: false,
        lastErrorReason: (endpointData[endpointData.length - 1] as IHiveEndpointDataDown).reason
      });

      continue;
    }

    // Calculate score as median latency + standard deviation of latencies as a penalty for unstable connection
    const score = median(latenciesForCalculation) + standardDeviation(latenciesForCalculation);

    // Add endpoint to up results with score as median latency
    resultsUp.push({
      endpointUrl,
      score,
      up: true,
      latencies: endpointData.filter(value => value.up).map(value => value.latency)
    });
  }

  // Calculate standard score of median latencies and sort in ascending order with matched up results
  const sortedDesc: IScoredEndpointUp[] = resultsUp.sort((a, b) => a.score - b.score);

  // Retrieve extreme values
  const min = sortedDesc[0].score;
  const max = sortedDesc[sortedDesc.length - 1].score;

  // Normalize data to range 0 - 1 (including down results with score 0) - all endpoints will be sorted in descending order based on the calculated score
  return [...sortedDesc.map(value => { value.score = 1.1 - scale(value.score, min, max, 0.1, 1); return value; }), ...resultsDown];
};
