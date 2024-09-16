import { type THiveEndpointData } from "./endpoint.js";
import { type TCalculateScoresFunction, type IScoredEndpoint } from "./healthchecker.js";

// XXX: Maybe use Opentelemetry histogram: https://github.com/open-telemetry/opentelemetry-js/blob/main/packages/sdk-metrics/src/aggregator/Histogram.ts
export const defaultCalcScores: TCalculateScoresFunction = (data: Readonly<Array<[string, Array<THiveEndpointData>]>>): Array<IScoredEndpoint> => {
    // Handle initial stats - on not enough data
    const topStats = data.map(value => value[1]).reduce((prev, curr) => curr.length > prev ? curr.length : prev, 0);

    const scale = (inputY: number, yMin: number, yMax: number, xMin: number, xMax: number): number => ((inputY - yMin) / ((yMax - yMin) || 1)) * (xMax - xMin) + xMin;
    const avg = (arr: number[]): number => arr.reduce((a, b) => a + b, 0) / arr.length;
    const standardDeviation = (arr: number[]): number => Math.sqrt(avg(arr.map(x => Math.pow(x - avg(arr), 2))));
    const standardScore = (arr: number[]): number[] => {
      const avgForArr = avg(arr);
      const stdDevForArr = standardDeviation(arr);

      return arr.map(value => (value - avgForArr)/(stdDevForArr || 1));
    };

    const results: Array<IScoredEndpoint> = [];

    for(const [endpointUrl, endpointData] of data) {
      // Start with 1 to avoid division by 0. If all of the fields are down it will be 0 no matter what: 0/1 = 1
      const upTimes = endpointData.reduce((prev, curr) => curr.up ? prev + 1 : prev, 1);

      if(upTimes === 1) {
        results.push({
          endpointUrl,
          score: 0,
          down: true
        });

        continue;
      }

      const topValue = endpointData.reduce((prev, curr) => curr.up ? (curr.latency > prev ? curr.latency : prev) : 0, 0);

      // Calculate the average from the standardization of timeouts (we assume here that down = topValue*2 ms) <- by the way, it calculates the stability of the response time from endpoints
      const dataFilledMissing = [...endpointData.map(value => value.up ? value.latency : topValue * 2), ...Array(topStats - endpointData.length).fill(topValue * 2)];
      const standardScoreValue = standardScore(dataFilledMissing);

      results.push({
        endpointUrl,
        score: avg(standardScoreValue) / upTimes,
        down: false
      });
    }

    // Now the less the score is the better it is

    // Sort by score in descending order to retrieve min and max values for normalization
    // Remove endpoints with 0 score - totally down
    const sortedDesc = results.filter(value => !value.down).sort((a, b) => a.score - b.score);

    const min = sortedDesc[0]?.score;
    const max = sortedDesc[sortedDesc.length - 1]?.score;

    // Normalize data to range 0.1 - 1
    return [...sortedDesc.map(value => { value.score = 1.1 - scale(value.score, min, max, 0.1, 1); return value; }), ...results.filter(value => value.down)];
};
