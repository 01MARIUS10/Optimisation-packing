import { Conteneur } from '../models/conteneur'
import type { Segment } from '../models/segment'

export function bestFit(segments: Segment[], conteneurLength: number): Conteneur[] {
  const conteneurs: Conteneur[] = []

  for (const segment of segments) {
    let ConteneurPetitReste: Conteneur | null = null
    let meilleurSegmentLibre: Segment | null = null

    //manesy conteneur existant
    for (const conteneur of conteneurs) {
      const segmentLibre = conteneur.getFreeSpace()

      //mijery izay atonona
      if (segmentLibre !== null && segmentLibre.canFit(segment)) {
        //mijery izay kely indrindra
        if (meilleurSegmentLibre === null || segmentLibre.isBetterThan(meilleurSegmentLibre)) {
          ConteneurPetitReste = conteneur
          meilleurSegmentLibre = segmentLibre
        }
      }
    }

    if (ConteneurPetitReste !== null) {
      ConteneurPetitReste.addSegment(segment)
    } else {
      const nouveau = new Conteneur(conteneurLength)
      nouveau.addSegment(segment)
      conteneurs.push(nouveau)
    }
  }

    console.log('ALGO bestFit', conteneurs);
  return conteneurs
}
