import { Conteneur } from '../models/conteneur'
import type { Segment } from '../models/segment'

export function worstFit(segments: Segment[], conteneurLength: number): Conteneur[] {
  const conteneurs: Conteneur[] = []

  for (const segment of segments) {
    let worstConteneur: Conteneur | null = null
    let worstFreeSegment: Segment | null = null

    //manesy conteneur existant
    for (const conteneur of conteneurs) {
      const freeSegment = conteneur.getFreeSpace()

      //mijery izay atonona
      if (freeSegment !== null && freeSegment.canFit(segment)) {
        //mijery izay lehibe indrindra
        if (worstFreeSegment === null || worstFreeSegment.isBetterThan(freeSegment)) {
          worstConteneur = conteneur
          worstFreeSegment = freeSegment
        }
      }
    }

    if (worstConteneur !== null) {
      worstConteneur.addSegment(segment)
    } else {
      const nouveau = new Conteneur(conteneurLength)
      nouveau.addSegment(segment)
      conteneurs.push(nouveau)
    }
  }
  console.log('ALGO worstFit', conteneurs);
  return conteneurs
}
