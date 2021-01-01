import { CompositeDecorator } from 'draft-js'

import { mentionStrategy, hashtagStrategy, entityStrategy } from './strategies'
import { TextSpan, EntitySpan } from './decoratorComponents'

const decorator = new CompositeDecorator([
  {
    strategy: entityStrategy,
    component: EntitySpan,
  },
  {
    strategy: mentionStrategy,
    component: TextSpan('Mention'),
  },
  {
    strategy: hashtagStrategy,
    component: TextSpan('Hashtag'),
  },
])

export default decorator
