# Mettre à jour les images de la galerie VR

Ce guide explique comment remplacer les images de la galerie (`assets/images/gallery/1..10`)
et réadapter [`gallery-environment.html`](./gallery-environment.html) pour que :

- la **largeur** de chaque tableau (cadre + image) reste **exactement celle déjà en place** dans la galerie ;
- la **hauteur** de l'image **et** du cadre s'adapte automatiquement au ratio de la nouvelle image,
  pour qu'**aucune image ne soit déformée**.

> ⚠️ On ne touche **jamais** à la `width` de l'image ni au `scaleY` du cadre.
> On recalcule **uniquement** la `height` de l'image et le `scaleX` du cadre.

---

## 1. Comprendre la structure d'un tableau

Chaque tableau = 3 éléments imbriqués :

```html
<a-entity id="gallery-frame-N-wrapper" scale="S S 1.5" position="..." rotation="...">
  <a-entity id="gallery-frame-N" gltf-model="#frame-asset" scale="X Y Z">   <!-- la moulure 3D -->
  </a-entity>
  <a-image  id="gallery-image-N" width="W" height="H" rotation="0 0 -90" .../> <!-- la photo -->
</a-entity>
```

- **wrapper** : place le tableau sur le mur et applique une échelle uniforme (X = Y) → **ne déforme rien**.
- **image** (`a-image`) : `width`/`height` définissent le ratio du plan affiché.
- **frame** (`gltf #frame-asset`) : modèle 3D séparé, étiré par son `scale` pour entourer l'image.

### Le piège : la rotation `0 0 -90` de l'image

L'image est tournée de -90° en Z, **mais pas le cadre**. Leurs axes sont donc croisés :

| Dimension de l'image | correspond à l'axe du cadre |
| -------------------- | --------------------------- |
| `width`  de l'image  | `scaleY` du cadre           |
| `height` de l'image  | **`scaleX`** du cadre       |

➡️ **Conséquence pratique** : quand on change la **hauteur de l'image**, c'est le **`scaleX` du cadre**
qu'il faut ajuster (pas le `scaleY`).

---

## 2. La règle de calcul

Pour chaque image `N`, on garde la `width` actuelle et on recalcule deux valeurs.

### a) Récupérer les dimensions en pixels de la nouvelle image

```bash
# Depuis la racine du projet (macOS) :
for i in 1 2 3 4 5 6 7 8 9 10; do
  f="assets/images/gallery/$i.avif"
  [ -f "$f" ] && echo "$i: $(sips -g pixelWidth -g pixelHeight "$f" | grep pixel | awk '{print $2}' | paste -sd 'x' -)"
done
```

On obtient pour chaque image `pixelW x pixelH`.

### b) Nouvelle hauteur de l'image

La photo n'est pas déformée si le ratio du plan = ratio des pixels :

```
height_image = width_image × (pixelH / pixelW)
```

> `width_image` = la valeur **déjà présente** dans le fichier (on ne la change pas).

### c) Nouveau `scaleX` du cadre

Le cadre doit suivre la même variation de hauteur que l'image. On multiplie son `scaleX` actuel
par le facteur de variation de la hauteur de l'image :

```
scaleX_frame_nouveau = scaleX_frame_actuel × (height_image_nouvelle / height_image_ancienne)
```

> Si l'ancienne hauteur d'image valait `1` (cas de départ historique), alors simplement :
> `scaleX_frame_nouveau = scaleX_frame_actuel × height_image_nouvelle`.

Le `scaleY` et le `scaleZ` du cadre, ainsi que le wrapper, **ne changent pas**.

---

## 3. Exemple concret

Image 7 : `width="2.327"`, ancienne `height="1"`, cadre `scale="0.59 1.09 2"`.
Nouvelle image `7.avif` = `3840 x 1877` px.

```
height_image = 2.327 × (1877 / 3840) = 2.327 × 0.48880 = 1.137
scaleX_frame = 0.59 × (1.137 / 1) = 0.671
```

Résultat :

```html
<a-entity id="gallery-frame-7" gltf-model="#frame-asset" scale="0.671 1.09 2"></a-entity>
<a-image  id="gallery-image-7" width="2.327" height="1.137" rotation="0 0 -90" .../>
```

---

## 4. Checklist de mise à jour

Pour chaque image `N` de 1 à 10 :

1. [ ] Remplacer le fichier `assets/images/gallery/N.avif` (même nom).
2. [ ] Lire ses pixels `pixelW x pixelH` (script ci-dessus).
3. [ ] **Garder** `width` de `gallery-image-N` inchangée.
4. [ ] Calculer puis écrire `height = width × (pixelH / pixelW)` (3 décimales).
5. [ ] Calculer puis écrire le nouveau `scaleX` de `gallery-frame-N`
       = `scaleX_actuel × (height_nouvelle / height_ancienne)`.
6. [ ] **Ne pas toucher** : `width` de l'image, `scaleY`/`scaleZ` du cadre, le wrapper, les `position`/`rotation`.
7. [ ] Vérifier dans la scène VR que l'image n'est pas déformée et que le cadre l'entoure bien.

---

## 5. Points de vigilance

- **Image quasi carrée** (ex. `8.avif` ≈ 3829×3840) → la hauteur devient ≈ égale à la largeur,
  donc un `scaleX` de cadre très grand (ex. `1.516`). C'est normal, mais ça fait un grand tableau :
  à valider à l'œil, ou réduire la `width` si l'on veut un tableau plus compact
  (mais cela change la largeur, contrairement à la règle de ce guide).
- **Moulure du cadre** : étirer le modèle GLTF épaissit la bordure dans un seul axe.
  Si une bordure paraît trop fine/épaisse, ajuster finement à la main après coup.
- Toujours travailler avec **3 décimales** pour rester cohérent avec le reste du fichier.
