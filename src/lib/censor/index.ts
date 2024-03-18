import {
  RegExpMatcher,
  TextCensor,
  englishDataset,
  englishRecommendedTransformers,
} from 'obscenity';

import { logger } from '@lib/logger';

const censor = new TextCensor();
const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

export const cleanInput = (input: string) => {
  const matches = matcher.getAllMatches(input, true);

  for (const match of matches) {
    const { phraseMetadata, startIndex, endIndex } =
      englishDataset.getPayloadWithPhraseMetadata(match);

    logger.log(
      'info',
      `Match for word ${phraseMetadata?.originalWord} found between ${startIndex} and ${endIndex}.`
    );
  }

  return censor.applyTo(input, matches);
};
