import { Conteneur } from '../models/conteneur'
import type { Form } from '../models/form'
import { Geometrie } from './geometrie'

interface Niveau {
  y: number
  height: number
  usedWidth: number
}

interface InfoPlacement {
  niveau: Niveau
  estNouveau: boolean
  w: number
}

/** Place une forme sur le premier niveau où elle rentre (rotations comprises),
 *  sinon ouvre un nouveau niveau. Retourne ce qu'il faut pour annuler le coup
 *  (`annulerPlacement`), ou `null` si la forme ne rentre nulle part. */
function placerForme(forme: Form, niveaux: Niveau[], conteneur: Conteneur, width: number, height: number): InfoPlacement | null {
  for (const niveau of niveaux) {
    if (Geometrie.essayerOrientations(forme, width - niveau.usedWidth, niveau.height) === null) continue
    const { w } = Geometrie.etendue(forme)
    Geometrie.placeAt(forme, niveau.usedWidth, height - niveau.y)
    if (conteneur.place(forme)) {
      niveau.usedWidth += w
      return { niveau, estNouveau: false, w }
    }
  }

  const newY = niveaux.length ? niveaux[niveaux.length - 1]!.y + niveaux[niveaux.length - 1]!.height : 0
  const espaceRestant = height - newY
  if (Geometrie.essayerOrientations(forme, width, espaceRestant) === null) return null

  const { w, h } = Geometrie.etendue(forme)
  Geometrie.placeAt(forme, 0, height - newY)
  if (!conteneur.place(forme)) return null

  const niveau: Niveau = { y: newY, height: h, usedWidth: w }
  niveaux.push(niveau)
  return { niveau, estNouveau: true, w }
}

/** Défait exactement ce que `placerForme` a fait, pour le retour sur trace. */
function annulerPlacement(forme: Form, info: InfoPlacement, niveaux: Niveau[], conteneur: Conteneur): void {
  conteneur.remove(forme)
  if (info.estNouveau) {
    niveaux.pop()
  } else {
    info.niveau.usedWidth -= info.w
  }
}

/** Brute Force (permutations d'insertion) : explore par backtracking l'ordre
 *  dans lequel les formes sont proposées à `placerForme` (premier niveau où
 *  elles rentrent, rotations comprises), et garde la séquence qui place le
 *  plus de formes (puis la plus grande surface en cas d'égalité). Ne connaît
 *  rien des formes concrètes — uniquement `getEspaceOccupe()`/`rotate()`, via
 *  la façade `Geometrie`. Coût factoriel dans le pire cas : deux mesures
 *  l'atténuent (comme pour la version 1D) — tri par surface décroissante pour
 *  trouver une bonne solution tôt, et arrêt immédiat dès qu'une solution place
 *  toutes les formes (record déjà optimal, inutile d'explorer plus loin). */
export function bruteForce(formesInput: Form[], width: number, height: number): Conteneur {
  const formes = [...formesInput].sort((a, b) => {
    const ea = Geometrie.etendue(a)
    const eb = Geometrie.etendue(b)
    return eb.w * eb.h - ea.w * ea.h
  })

  let meilleureSequence: Form[] = []
  let maxFormesPlacees = -1
  let maxSurfaceOccupee = -1

  const utilise = new Array<boolean>(formes.length).fill(false)
  const sequenceActuelle: Form[] = []

  function explorer(conteneurActuel: Conteneur, niveaux: Niveau[], surfaceActuelle: number): void {
    if (maxFormesPlacees === formes.length) return // déjà optimal, inutile de continuer

    const nbPlaces = sequenceActuelle.length
    if (nbPlaces > maxFormesPlacees || (nbPlaces === maxFormesPlacees && surfaceActuelle > maxSurfaceOccupee)) {
      maxFormesPlacees = nbPlaces
      maxSurfaceOccupee = surfaceActuelle
      meilleureSequence = [...sequenceActuelle]
      if (maxFormesPlacees === formes.length) return // on vient de trouver l'optimal
    }

    for (let i = 0; i < formes.length; i++) {
      if (utilise[i]) continue
      const forme = formes[i]!

      const info = placerForme(forme, niveaux, conteneurActuel, width, height)
      if (info === null) continue

      utilise[i] = true
      sequenceActuelle.push(forme)
      explorer(conteneurActuel, niveaux, surfaceActuelle + Geometrie.etendue(forme).w * Geometrie.etendue(forme).h)
      sequenceActuelle.pop()
      utilise[i] = false
      annulerPlacement(forme, info, niveaux, conteneurActuel)

      if (maxFormesPlacees === formes.length) return // optimal trouvé pendant la récursion : on s'arrête là aussi
    }
  }

  if (formes.length > 0) {
    explorer(new Conteneur(width, height), [], 0)
  }

  // Reconstruit la solution gagnante depuis zéro plutôt que de retourner les
  // formes telles que l'exploration les a laissées : ce sont des objets
  // partagés, mutés par toutes les branches explorées après la meilleure —
  // un instantané pris "en cours de route" serait donc obsolète une fois la
  // recherche terminée. Le replay est déterministe (même séquence, même
  // bookkeeping de niveaux) donc reproduit exactement la solution gagnante.
  const resultat = new Conteneur(width, height)
  const niveauxFinal: Niveau[] = []
  for (const forme of meilleureSequence) {
    placerForme(forme, niveauxFinal, resultat, width, height)
  }

  return resultat
}
