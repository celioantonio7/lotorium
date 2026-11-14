# Raccoon scene assets

Generated with the built-in image generation tool on 2026-11-14. Original supplied images are preserved. The website uses lossless WebP with alpha preserved; the generated files are 1086 × 1448, not a new 4K master.

## Open eyes

Source: `Imagem ChatGPT 14_11_2026, 09_24_22-1.png`.
Output: `public/assets/lotorium/about-raccoon-v2.webp`.

Prompt:

Use case: precise-object-edit. Production website transparent 3D character asset, portrait aspect ratio 3:4, highest available resolution at least 2048px tall. EDIT TARGET: attached full-body armored raccoon. Preserve the exact crouching pose, same limb endpoints, full striped tail at lower left, cape flowing left, same metallic charcoal/silver armor and lime-green rim lighting, same camera and proportions and overall silhouette outside head. Essential correction: replace the malformed tall pointed hood above the face with a properly fitted rounded helmet and TWO clearly visible anatomically correct raccoon ears, symmetrically placed on the upper left and upper right of the head, pointing up and slightly outward. Both ears have silver outer rims, black inner ears, thin lime illuminated outline. No third ear, no tall pointed hood masquerading as an ear. Match the attached website screenshot character concept: smaller rounded helmet crown with two distinct ears. Keep eyes OPEN, narrow glowing lime eyes, calm intelligent expression. Improve crisp microdetail, smooth natural alpha edges with no jagged green fringe or checkerboard; sharp clean high-quality 3D render. Preserve original framing and transparent margins as closely as possible: full front boot sole and full right-side hand visible, not cropped. Background must be genuinely transparent alpha. No rocks, no ground, no text, no watermark. Do not change pose or turn head.

## Closed eyes

Source: generated open-eye PNG.
Output: `public/assets/lotorium/about-raccoon-closed-v2.webp`.

Prompt:

Use case precise-object-edit. This is animation frame 2 for blinking. Edit ONLY the two glowing lime eyes on this exact transparent full-body raccoon image. Close BOTH eyelids naturally, making narrow curved dark closed eyelid slits with a faint green rim. Preserve EVERYTHING else exactly pixel-aligned: identical canvas 1086x1448, identical ears, helmet, head location, nose, expression, pose, cape, tail, armor, hands, boots, lighting and alpha silhouette. No movement, no scaling, no new framing, no cropping, no background. Output genuine transparent alpha. The eye change must be restricted to small eye areas centered near x=555,y=458 and x=681,y=458. Eyes closed, not luminous open pupils. This asset will be composited only over the eyes of the open frame.

Only the eyes of the second frame are composited onto the first frame, so differences in generated body pixels do not animate. Character, contact shadows, and rocks share a parallax transform to preserve footing. The supplied landscape is reused in About and Contact. Fog renders at up to 480 pixels wide and 20 frames per second; source artwork keeps its own resolution. All effects pause offscreen or when the tab is hidden, and respect reduced motion.

## Menu, footer, and favicon logo

Source: `logolotorium.png`. Background removal used the built-in image generation tool.
Master: `public/assets/lotorium/logo-lotorium.webp`.
UI: `public/assets/lotorium/logo-lotorium-512.webp`.
Favicon: `public/assets/lotorium/favicon.webp`.

Prompt: Use case: background-extraction. EDIT TARGET is the attached Lotorium raccoon emblem. Remove ONLY the surrounding black background to genuine transparent alpha. Preserve the EXACT emblem design, shape, both pointed silver ears, dark metallic helmet, symmetrical brushed silver facial armor, two solid lime-green eyes, lime cheek highlights, and black nose. Keep internal black and dark gray regions of the emblem opaque: do not punch holes in the face or ears. No redesign, no illustration changes, no new lettering, no text, no shadow on the background, no checkerboard baked in. Return a clean high-quality production transparent logo, centered on a square canvas, emblem occupying about 90% of width, with small consistent transparent padding. Crisp clean smooth alpha edge, suitable for a navbar, footer and favicon. Preserve the original visual identity faithfully.
