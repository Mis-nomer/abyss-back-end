import {
  RegExpMatcher,
  TextCensor,
  englishDataset,
  englishRecommendedTransformers,
} from 'obscenity';

const censor = new TextCensor();
const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

export default (input: string) => {
  const matches = matcher.getAllMatches(input, true);

  // for (const match of matches) {
  //   const { phraseMetadata, startIndex, endIndex } =
  //     englishDataset.getPayloadWithPhraseMetadata(match);

  //   logger.debug(
  //     'info',
  //     `Match for word ${phraseMetadata?.originalWord} found between ${startIndex} and ${endIndex}.`
  //   );
  // }

  return censor.applyTo(input, matches);
};
