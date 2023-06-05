import PinataClient from '@pinata/sdk';
import { Canvg, presets } from 'canvg';
import {DOMParser} from 'xmldom';
import canvas from 'canvas';

const PINATA_IPFS_BASE_URL = process.env.PINATA_IPFS_BASE_URL ?? 'https://gateway.pinata.cloud/ipfs/';

const { PINATA_API_KEY, PINATA_API_SECRET } = process.env;
if (!(PINATA_API_KEY || PINATA_API_SECRET)) {
  console.error('Environment variables PINATA_API_KEY and PINATA_API_SECRET are required to run the pinata client');
}
const pinata = new PinataClient(PINATA_API_KEY, PINATA_API_SECRET);

async function toPng(data: { width: number, height: number, svg: string }) {
  const { width, height, svg } = data;
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');
  // @ts-ignore
  const v = await Canvg.from(ctx, svg, preset);
  await v.render();
  const blob = await canvas.convertToBlob();
  const pngUrl = URL.createObjectURL(blob);

  return pngUrl;
}


const svgTemplate = `
  <?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
width="400"
height="400"
viewBox="0 0 32 32"
id="Layer_1"
version="1.1"
xml:space="preserve"
xmlns="http://www.w3.org/2000/svg"
xmlns:svg="http://www.w3.org/2000/svg"><defs
id="defs30"><rect
x="313.51105"
y="470.46402"
width="53.27766"
height="15.338398"
id="rect1098" /></defs>

<style
type="text/css"
id="style17">
.st0{fill:#00BBB4;}
.st1{fill:#1B75BC;}
.st2{fill:#F15A29;}
</style>

<g
id="g25">

<path
class="st0"
d="M 6.91291,4.3709016 H 26.327869 V 3.6106558 C 26.327869,2.1688333 25.159035,1 23.717213,1 H 5.3709016 C 3.5092294,1 2,2.5091734 2,4.3709016 2,6.232574 3.5092294,7.7418032 5.3709016,7.7418032 H 5.6721311 V 5.6116805 c 0,-0.6852751 0.5555038,-1.2407789 1.2407789,-1.2407789 z"
id="path19" />

<path
class="st2"
d="M 27.759222,5.3709016 H 7.7489753 c -0.6852746,0 -1.2407784,0.5555038 -1.2407784,1.2407789 V 8.7418032 H 29 V 6.6116805 C 29,5.9264054 28.444496,5.3709016 27.759222,5.3709016 Z"
id="path21" />

<path
class="st1"
d="M 20.561462,18.262268 H 30 V 10.941895 C 30,10.279114 29.462707,9.7417603 28.799866,9.7417603 H 5.3709106 C 3.5092163,9.7417603 2,8.2325439 2,6.3709106 V 29.450806 C 2,30.306397 2.6936035,31 3.5491943,31 H 27.389343 C 28.831177,31 30,29.831177 30,28.389343 v -4.446716 h -9.438538 c -1.568542,0 -2.840149,-1.271606 -2.840149,-2.84021 0,-1.568543 1.271607,-2.840149 2.840149,-2.840149 z"
id="path23" />

</g>

<path
id="rect188"
style="fill:#ffff00;stroke-width:0.0458102"
d="M 14.211207,18.262268 H 30 c 0,0 0,0 0,2.845988 0,2.845989 0,2.845989 0,2.845989 H 14.211207 c -1.554517,0 -2.805988,-1.269311 -2.805988,-2.845989 0,-1.576677 1.251471,-2.845988 2.805988,-2.845988 z" /><text
xml:space="preserve"
transform="matrix(0.32,0,0,0.32,-86.966103,-130.84543)"
id="text1096"
style="font-weight:bold;font-size:8px;font-family:sans-serif;-inkscape-font-specification:'sans-serif Bold';white-space:pre;shape-inside:url(#rect1098);fill:#ffff00"><tspan
x="313.51172"
y="477.76349"
id="tspan843"><tspan
style="fill:#ff0000"
id="tspan841">{{SCORE_VALUE}}</tspan></tspan></text></svg>`;


export const NftLevels = [
  {
    title: 'Normal',
    description: 'This is a basic badge that unlocks at 3000cJPY.',
    earning: 8000,
    url: '/nft/normal.svg',
  },
  {
    title: 'Premium',
    description: 'This badge unlocks when you earn at least 5000cJPY.',
    earning: 20000,
    url: '/nft/premium.svg',
  }
];

export const IpfsUtils = {
  pin: function() {

  },
  pinImage: function() {

  },
  pinMetaData: function() {

  },
  renderSvg: async function(content: string, width=800, height=800) {
    const preset = presets.node({
      DOMParser: DOMParser, canvas, fetch });
    const result = svgTemplate.replace('{{SCORE_VALUE}}', content);

    const _canvas = preset.createCanvas(width, height);
    const context = _canvas.getContext('2d');
    const renderer = Canvg.fromString(context, result, preset);
    await renderer.render()
    return _canvas.toBuffer('image/png')
  },
  getRewardTitle: function(point: number) {
    if (point >= 8000) {
      return 'Expert';
    } else if (point >= 5000) {
      return 'Intermediate';
    } else if (point >= 3000) {
      return 'Beginner';
    }
    return null;
  },
  getStoragePath: function(address: `0x${string}`) {
    return `pitpa/citNFT/${address.toLowerCase()}.json`;
  },
  retrieveFromStorage: function(address: `0x${string}`) {

  },
};
