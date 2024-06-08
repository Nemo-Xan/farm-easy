import { images } from './images'

export const servicesList = {
  tractor: {
    name:  'tractor',
    hire: 'Hire a Tractor',
    full: 'Tractor',
    image: images.tractor
  },
  plough: {
    name:  'plough',
    hire: 'Hire a Plough',
    full: 'Plough',
    image: images.plough
  },
  ridger: {
    name:  'ridger',
    hire: 'Hire a Ridger',
    full: 'Ridger',
    image: images.ridger
  },
  planter: {
    name:  'planter',
    hire: 'Hire a Planter',
    full: 'Planter',
    image: images.planter
  },
  seed: {
    name:  'seed',
    hire: 'Buy Seeds',
    full: 'Seed',
    image: images.seed,
    resize: true,
    quantity: true
  },
  pesticide: {
    name:  'pesticide',
    hire: 'Buy Pesticide / Herbicide',
    full: 'Pesticide/Herbicide',
    image: images.pesticide,
    quantity: true
  },
  fertilizer: {
    name:  'fertilizer',
    hire: 'Buy Fertilizer',
    full: 'Fertilizer',
    image: images.fertilizer,
    quantity: true
  },
  harrow: {
    name:  'harrow',
    hire: 'Hire a Harrow',
    full: 'Harrow',
    image: images.harrow
  },
  treasher: {
    name:  'treasher',
    hire: 'Hire a Treasher',
    full: 'Treasher',
    image: images.treasher
  },
  harvester: {
    name:  'harvester',
    hire: 'Hire a Harvester',
    full: 'Harvester',
    image: images.harvester 
  },
  "farm extension manager": {
    name: 'Farm Extension Manager',
    hire: 'Request Extension Service',
    full: 'Extension Service',
    url: 'extension',
    image: images.extension
  },
  "boom sprayer": {
    name: 'Boom Sprayer',
    hire: 'Hire a Boom Sprayer',
    full: 'Boom Sprayer',
    url: 'boom',
    image: images.boom
  },
  "off taker": {
    name: 'off taker',
    hire: 'Inform an Off-Taker',
    image: images.offtaker,
    full: 'Off Taker',
    url: 'offtaker',
  }
}

export const servicesType = {
  services: [
    'tractor', 'plough', 'harrow', 'ridger', 'planter', 'boom sprayer', 'treasher'
  ],
  products: [
    'seed', 'pesticide', 'fertilizer', 'off taker', 'farm extension manager'
  ]
}