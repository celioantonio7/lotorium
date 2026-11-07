import LavaImage from "./LavaImage";
export default function TerrainSides() {
  return <div className="terrain-sides" aria-hidden="true"><LavaImage variant="left" className="terrain-side terrain-side-left" /><LavaImage variant="right" className="terrain-side terrain-side-right" /></div>;
}
