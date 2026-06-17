import { Conteneur } from '../models/conteneur'
import type { Segment } from '../models/segment'


export function firstFit(segments: Segment[], conteneurLength: number): Conteneur[] {
  const conteneurs: Conteneur[] = []

  for (const segment of segments) {
    let placed = false

    //apetraka ao amin'ny conteneur misy
    for (const conteneur of conteneurs) {
      const freeSegment = conteneur.getFreeSpace()

      if (freeSegment !== null && freeSegment.canFit(segment)) {
        conteneur.addSegment(segment)
        placed = true
        break
      }
    }

    if (!placed) {
      const nouveau = new Conteneur(conteneurLength)
      nouveau.addSegment(segment)
      conteneurs.push(nouveau)
    }
  }

    console.log('ALGO firstFit', conteneurs);
  return conteneurs
}

