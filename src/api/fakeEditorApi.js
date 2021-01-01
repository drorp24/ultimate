// ? input structure
// draft - js('draft') is a famous library by Facebook that fits our needs perfectly.
// To be able to do its job, draft requires the following JSON structure, defined using Flow here:
// https://github.com/facebook/draft-js/blob/master/src/model/encoding/RawDraftContentState.js
//
// That input structure is normalized, so that the only data pertaining to entities' occurrences
// in the text is their offsets and lengths there,
// and the foreign key to the respective entity record, where the entity data is held.
//
// Thus draft implements the many-to-one relationship b/w entity occurrences in the text (e.g., "Moshe", "he")
// and their respective entity records.
//
// Accordingly, the structure has two main keys:
// - blocks: an array of text blocks. Each block has an array with entity occurrences ("entityRanges").
//   To keep it normalized, each occurrence has only 'offset', 'length' and 'key', pointing to 'entityMap's key.
// - entityMap: an object whose every key is an entity record, keyed by that referenced 'key'.
//
// draft ignores (= doesn't convert) any key in an entity record other than
// 'type', 'mutability' and 'data'. Even Id gets ignored!
// Hence anything we want to survive draft's conversion must sit in the 'data' object.
// One field we must include in the 'data' is the original key. Here's why.
//
// ? draft conversion
// To do its thing, draft has to convert the input JSON ("rawContent") into
// its own different (Immutable.js - based) structure.
// Oddly, the original 'keys' never make it into draft's converted structure.
// Instead they are replaced during conversion by ad-hoc generated IDs called 'entityKey's.
//
// In places where we use the draft's functionlity (e.g., decoratorComponents),
// what this means is we're getting draft's entityKeys rather than our original 'keys'.
//
// As the following paragrpha explain, we mostly need the original key rather than draft's entityKey,
// and that's why we need the original keys recorded on the entity's 'data' part.
//
// We will want the original keys whenever we are to retrieve or update an entity,
// since entities in redux are keyed by the original keys.
//
// One reason why redux keys entities by their original keys is the rendering of the relationship graph.
// To render it, we traverse the relations graph by nodes, which are identified by their original keys
// and update every such referenced entity node with the list of input and output nodes.
// This definitely calls for direct access by the original 'keys'.
//
// Another reason would be the need to click or hover a point on the map and get details about the
// entity represented by that point, using the original key again.
// I am sure there will be several more use cases going forward for this kind of keying.
//

import telAviv from './telAviv'
import benYehuda from './benYehuda'
import metzitzim from './metzitzim'
import urisHome from './urisHome'

const timeout = 100

const rawContent = {
  blocks: [
    {
      key: 'b1',
      text: 'Uri goes to the beach every Saturday morning.',
      entityRanges: [
        {
          offset: 0,
          length: 3,
          key: 'firstEntity',
        },
        {
          offset: 16,
          length: 5,
          key: 'secondEntity',
        },
        {
          offset: 28,
          length: 16,
          key: 'thirdEntity',
        },
      ],
    },
    {
      key: 'b2',
      text: '',
    },
    {
      key: 'b3',
      text: '',
    },
    {
      key: 'b4',
      text:
        'He lives in Tel Aviv, and the beach is right across Ben Yehuda street where his home is.',
      entityRanges: [
        {
          offset: 0,
          length: 2,
          key: 'firstEntity',
        },
        {
          offset: 12,
          length: 8,
          key: 'fourthEntity',
        },
        {
          offset: 52,
          length: 10,
          key: 'fifthEntity',
        },
        {
          offset: 80,
          length: 4,
          key: 'eighthEntity',
        },
      ],
    },
    {
      key: 'b5',
      text: '',
    },
    {
      key: 'b6',
      text: '',
    },
    {
      key: 'b7',
      text: "When he's there, Uri likes listening to music on his iPhone.",
      entityRanges: [
        {
          offset: 17,
          length: 3,
          key: 'firstEntity',
        },
        {
          offset: 53,
          length: 6,
          key: 'sixthEntity',
        },
      ],
    },
    {
      key: 'b8',
      text: '',
    },
    {
      key: 'b9',
      text: '',
    },
    {
      key: 'b10',
      text: 'His girlfriend Vered usually joins.',
      entityRanges: [
        {
          offset: 15,
          length: 5,
          key: 'seventhEntity',
        },
      ],
    },
  ],

  entityMap: {
    firstEntity: {
      willbeIgnored: 'ignored',
      type: 'PERSON',
      mutability: 'IMMUTABLE',
      data: {
        id: 'firstEntity',
        name: 'Uri',
        score: 19.99,
        subTypes: ['Young', 'Male'],
        tag: 'yes',
      },
    },
    secondEntity: {
      type: 'LOCATION',
      mutability: 'IMMUTABLE',
      data: {
        id: 'secondEntity',
        name: 'beach',
        score: 12.99,
        subTypes: ['Area'],
        geoLocation: {
          type: 'Feature',
          properties: {
            name: 'Metzitzim',
          },
          geometry: {
            type: 'Polygon',
            coordinates: metzitzim,
          },
        },
      },
    },
    thirdEntity: {
      type: 'TIME',
      mutability: 'IMMUTABLE',
      data: {
        id: 'thirdEntity',
        name: 'Saturday morning',
        score: 10.99,
        subTypes: ['Day off'],
      },
    },
    fourthEntity: {
      type: 'LOCATION',
      mutability: 'IMMUTABLE',
      data: {
        id: 'fourthEntity',
        name: 'Tel Aviv',
        score: 11.99,
        subTypes: ['City'],
        geoLocation: {
          type: 'Feature',
          properties: {
            name: 'TelAviv',
          },
          geometry: {
            type: 'Polygon',
            coordinates: telAviv,
          },
        },
      },
    },
    fifthEntity: {
      type: 'LOCATION',
      mutability: 'MUTABLE',
      data: {
        id: 'fifthEntity',
        name: 'Ben Yehuda',
        score: 10.99,
        subTypes: ['Street'],
        geoLocation: {
          type: 'Feature',
          properties: {
            name: 'Ben Yehuda',
          },
          geometry: {
            type: 'LineString',
            coordinates: benYehuda,
          },
        },
      },
    },
    sixthEntity: {
      type: 'DEVICE',
      mutability: 'MUTABLE',
      data: {
        id: 'sixthEntity',
        name: 'iPhone',
        score: 10.99,
        subTypes: ['Communication'],
      },
    },
    seventhEntity: {
      type: 'PERSON',
      mutability: 'SEGMENTED',
      data: {
        id: 'seventhEntity',
        name: 'Vered',
        score: 8.99,
        subTypes: ['Developer', 'Female'],
      },
    },
    eighthEntity: {
      type: 'LOCATION',
      mutability: 'SEGMENTED',
      data: {
        id: 'eighthEntity',
        name: 'home',
        score: 8.99,
        subTypes: ['Apartment'],
        geoLocation: {
          type: 'Feature',
          properties: {
            name: 'Uris home',
          },
          geometry: {
            type: 'Point',
            coordinates: urisHome,
          },
        },
      },
    },
  },
  relations: [
    // assumptions:
    // - graph is unidirectional

    {
      from: 'secondEntity',
      to: 'fourthEntity',
      type: 'in',
    },
    {
      from: 'secondEntity',
      to: 'fifthEntity',
      type: 'near',
    },
    {
      from: 'seventhEntity',
      to: 'firstEntity',
      type: 'girlfriend',
    },
    {
      from: 'eighthEntity',
      to: 'fifthEntity',
      type: 'in',
    },
  ],
}

export const getContent = () =>
  new Promise((resolve, reject) => {
    if (!rawContent) {
      return setTimeout(() => reject(new Error('Content unavailable')), timeout)
    }

    setTimeout(() => resolve(rawContent), timeout)
  })
