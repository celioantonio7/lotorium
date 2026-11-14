# Lotorium

Landing page React + Vite + TypeScript, com Tailwind, GSAP/ScrollTrigger, Lenis e Motion. Os nove PNGs na raiz são referências; as seções são HTML, CSS e SVG.

## Executar

```sh
npm install
npm run dev
```

Abra o endereço exibido pelo Vite. Para validar e gerar a versão de produção:

```sh
npm run build
npm run preview
```

## Trocar conteúdo

Edite **`src/data/site.json`**. Não precisa alterar os componentes para mudar:

- Textos, títulos, botões e serviços: objetos de cada seção.
- Menu: `navigation`.
- Mascote e identidade: `brand`. Coloque os arquivos em `public/assets/lotorium/` e use caminhos começando com `./assets/lotorium/`.
- Produtos: `products.items`. Substitua `image` por um caminho de imagem, atualize `imageAlt`, `url` e defina `demo: false`. Enquanto `image` estiver vazio, será exibida uma interface demonstrativa desenhada em HTML/CSS.
- Projetos de website: `projects` e `web.featuredProjectId`, com imagens, descrições e URLs dos materiais do portfólio.
- Contato: `contact.email`, `contact.whatsapp` (código do país e DDD) e `contact.endpoint`.
- Redes sociais: `footer.socials`, por exemplo `[{"label":"Instagram","url":"https://www.instagram.com/SEU_PERFIL"}]`.
- SEO: `seo`. Antes de publicar, preencha `siteUrl` com a URL pública. Os metadados estáticos do `index.html` são sincronizados automaticamente antes de `npm run dev` e `npm run build`, inclusive para robôs sem JavaScript. Para compartilhamento social, a imagem `social.webp` de 1200 × 630 já está configurada; troque `socialImage` se quiser usar outra.

As cores principais ficam no início de `src/styles/global.css`. A cor de cada produto fica em `products.items[].accent` no JSON.

## Envio do formulário

Sem `contact.endpoint`, o formulário valida os campos, preserva os dados e informa que o envio não está disponível. Nunca exibe sucesso simulado.

Com um endpoint configurado, envia JSON por `POST`:

```json
{
  "name": "Nome",
  "email": "nome@empresa.com",
  "phone": "(11) 99999-9999",
  "service": "Software sob medida",
  "message": "Descrição do projeto"
}
```

O backend deve validar o conteúdo, aplicar proteção contra abuso, permitir CORS para o domínio do site e devolver HTTP 2xx somente quando aceitar a mensagem. O frontend cancela a requisição após 15 segundos. Não coloque chaves privadas no JSON. Respostas HTTP de erro preservam os campos para nova tentativa.

## Organização

`src/components/sections/`: um componente por seção.
`src/components/layout/`: cabeçalho e rodapé.
`src/components/ui/`: elementos reutilizáveis.
`src/hooks/useAnimations.ts`: integração GSAP, ScrollTrigger e Lenis, com limpeza ao desmontar.
`src/styles/global.css`: design system e responsividade.
`src/data/site.json`: conteúdo editável.

Os assets originais na raiz foram preservados. Fontes são servidas localmente. A preferência por movimento reduzido desativa animações de scroll e movimento contínuo.

## Efeitos, menu e rodapé

- `effects.shader`: ativa/desativa o shader, ajusta cor, velocidade, opacidade no desktop/celular e resolução máxima.
- `effects.scroll`: intensidade do scrub, distância de entrada das seções, velocidade do smooth scroll, stagger dos títulos e transições ao navegar pelo menu.
- `effects.footerWordmark`: palavra em grande escala no rodapé.
- `ui`: rótulos dos menus, chamadas do rodapé e mensagens das transições.
- `navigation[].caption` e `navigation[].icon`: texto auxiliar e ícone do menu de tela inteira.

Os shaders são componentes WebGL 2D do React Bits, sem Three.js. O fundo atual usa Dark Veil. O componente é carregado sob demanda, tem limite de resolução e para fora da viewport ou com a aba oculta. Em movimento reduzido ele é desmontado e substituído por um fundo CSS estático. Se WebGL não estiver disponível, o conteúdo permanece navegável com o fundo CSS.

O menu suporta teclado, Escape, contenção do foco e bloqueio de rolagem do conteúdo. Na landing page, as transições acontecem entre seções ao navegar pelo menu; links de produtos externos continuam abrindo seus destinos normalmente.

Referências consultadas:

- [React Bits Light Rays](https://reactbits.dev/c/backgrounds/light-rays), fonte incorporada em `src/components/animations/reactbits/` com licença preservada.
- [Footer Giant Type, Estúdios Víctor Córdon, Awwwards](https://www.awwwards.com/inspiration/footer-giant-type-estudios-victor-cordon).
- [Footer Design, Lawless Studio, Awwwards](https://www.awwwards.com/inspiration/footer-design-lawless-studio).

Os layouts e animações da Lotorium são implementados no projeto; essas referências orientam a composição, sem incorporar sites de terceiros.

## Abertura, processo fixado e modais

- `effects.preloader`: liga/desliga a abertura, define a duração mínima da animação e o limite de espera. A abertura aguarda fontes, mascote e módulo do shader; a barra acompanha essas tarefas. O botão permite pular a abertura. A saída é um traçado SVG animado.
- `effects.process`: controla o pin, a distância de rolagem em telas de desktop/celular e a suavidade da sequência. O SVG é desenhado progressivamente e cada etapa acende quando a linha chega até ela. Com movimento reduzido, o processo volta a ser uma lista normal.
- O fundo agora usa **Dark Veil, do React Bits**, um shader 2D WebGL animado. `effects.shader` controla cor, velocidade, intensidade, fluxo e distorção. O código foi ajustado para redimensionamento do framebuffer e limpeza compatível com StrictMode. Sem Three.js.
- `solutions.items[].deliverables`, `bestFor`, `approach` e `examples` alimentam o modal de cada solução. `examples` é uma lista de IDs de `projects`.
- `projects`: fonte dos projetos reais, imagens, descrições, categorias, links e ajuste da imagem (`cover` ou `contain`). `web.featuredProjectId` escolhe o destaque da seção Web & Design.
- Os arquivos reais foram copiados de `/home/celio/Documentos/celioportifolio/public/projects/` para `public/assets/projects/`; o portfólio original foi preservado. Imagens de marca são identificadas como identidade, sem apresentá-las como screenshots de um sistema.
- Os modais têm foco contido, fechamento com Escape ou clique no fundo, rolagem interna, transparência e parallax. O ícone de fechar é uma animação Lottie original, editável em `src/data/close-icon.json`, renderizada em SVG e carregada sob demanda.

Para trocar uma imagem, copie o novo arquivo para `public/assets/projects/` e atualize o caminho em `projects[].image` ou em `products.items[].image`. Mantenha `imageAlt` descritivo. Os exemplos das soluções acompanham automaticamente os IDs configurados no JSON.

Referência do shader atual: [Dark Veil, React Bits](https://reactbits.dev/c/backgrounds/dark-veil). A licença de terceiros acompanha o código e está disponível em `public/licenses/react-bits.txt`.

## PNGs, lava e conexões da IA

`visuals` em `src/data/site.json` centraliza os novos elementos:

- `about`, `left`, `center`, `right`: caminho e dimensões dos PNGs transparentes. Ao trocar uma imagem, atualize também `width` e `height`.
- `lava.speed`: velocidade do movimento luminoso; `lava.intensity`: opacidade, de 0 a 1.
- `automation.durations`: tempo de viagem em segundos para WhatsApp, Agenda, Banco de dados, Cloud e Dashboard, nessa ordem. Use valores positivos.
- `automation.pause`: intervalo entre viagens, em segundos.

A lava usa Canvas 2D e uma máscara calculada dos pixels verdes do próprio PNG. A imagem original fica intacta. A animação pausa fora da tela e com a aba oculta; movimento reduzido mantém apenas a imagem estática. Não há modelos, câmeras ou cenas 3D. A IA pulsa ao término real de cada viagem, com as conexões e os cartões na mesma escala SVG.

O processo usa a montanha ascendente (`visuals.right`) dentro da própria timeline. `visuals.processRidge` define a altura normalizada da crista nas cinco etapas; o SVG mede os centros dos ícones para acompanhar o mesmo trajeto. Se trocar essa imagem por outra silhueta, ajuste esses cinco valores. As etapas em português ficam em `process.steps[].name`. O rodapé usa as montanhas `left` e `right`, e o destaque da abertura continua editável em `hero.highlight`.

O rodapé reutiliza `TechText.tsx` e `TechText.css` do projeto local Drisabelle: varredura, contornos tracejados, seleção e reação das letras ao clique/arrasto. `effects.footerTechText` controla velocidade, alcance, partículas e interações. Com movimento reduzido, a palavra fica estática. A marca começa com L maiúsculo também no cabeçalho e no menu.

O cabeçalho esconde após descer mais de 12 px e reaparece ao subir ou receber foco pelo teclado. `hero.technologyHints` fornece as descrições dos ícones da abertura. `TerrainSides` reúne as duas montanhas usadas nas seções; o processo usa uma única montanha na base, sem sobrepor texturas. O laptop em CSS usa uma captura real da Lotorium como destaque, sem substituir os projetos anteriores.

As molduras de notebook, iPhone e tablet usam uma seleção do [Devices.css](https://github.com/picturepan2/devices.css), com licença MIT em `public/licenses/devices-css.txt`. `web.deviceImages` define as capturas responsivas de celular/tablet e o projeto em destaque fornece a tela do notebook. No Sobre, o guaxinim transparente (`visuals.about`) e a montanha (`visuals.right`) ficam em camadas independentes, sem quadro decorativo. As etapas do processo permanecem legíveis; a etapa atual recebe brilho e halo animado, inclusive em janelas de 1366 x 680.

## Narrativa de rolagem e piscada

- `effects.heroTransition`: pin da Hero, distância de rolagem, marca, legenda e palavras de fundo. A Hero se recolhe, destaca o guaxinim e revela a assinatura antes do Sobre, seguindo a referência local de `Documentos/advogado`.
- `effects.blink`: ativa a piscada, define intervalo (`2000` ms), duração (`160` ms) e imagem dos olhos fechados. A variante foi editada a partir do original; no navegador ela é mascarada apenas sobre os olhos, preservando os demais pixels do personagem aberto. A piscada pausa fora da tela, com a aba oculta e em movimento reduzido.
- `storyTransitions.arc.words`: roda circular que gira enquanto os cartões de projetos encolhem no centro, entre Soluções e Produtos.
- `storyTransitions.curve`: `quote`, `signature`, `rows` e `ticker` editam o quadro antes do Contato. A curva preta desenha a entrada e o quadro se expande para revelar o conteúdo.
- O PNG do Sobre fica ancorado à borda da seção, compensando sua margem transparente de 16 px para encostar o desenho à área anterior à barra de rolagem.
- O Processo agora usa somente a montanha `visuals.right`, em proporção natural e apoiada na base, com cartões de vidro e marcadores medidos pelo mesmo SVG. O mobile mantém a sequência vertical.

## Publicação

O site público fica em https://celioantonio7.github.io/lotorium/. Pushes em `main` executam o build e publicam `dist` pelo workflow `.github/workflows/deploy.yml`. O Vite usa a base `/lotorium/`; os assets configuráveis usam caminhos relativos para funcionar nesse subdiretório.

Hero e Sobre usam `useSynchronizedBlink`: o mesmo relógio e os valores de `effects.blink` (intervalo de 2000 ms, fechamento de 160 ms). Entrar na viewport ou carregar uma imagem depois não reinicia a fase da piscada. As animações pausam fora da tela, com a aba oculta ou movimento reduzido.
