export type ModulationKey = 'am-lc' | 'am-sc' | 'fm' | '2ask' | '4ask' | '2psk' | '4psk' | '2fsk' | '4fsk';

export type ModulationAmplitudeModifier = {
  [value: string]: number;
};

export type DisplayedCanvases = 'sine' | 'binaryLevel1' | 'binaryLevel2' | 'binaryLevel4';

export type DataSignalCanvas = {
  type: DisplayedCanvases;
  data: DataSignalCanvasData;
};

export type DataSignalCanvasOptions = {
  [key in DisplayedCanvases]: DataSignalCanvasData;
};

export type DataSignalCanvasData = {
  title: string;
  description: string;
  isBinary: boolean;
  data: number[];
};

export type Modulation = {
  key: ModulationKey;
  label: Uppercase<ModulationKey>;
  type: 'analog' | 'digital';
  generator: (...signalValues: number[]) => number;
  description: string;
  canvas: DisplayedCanvases[];
};

export type ModulationToDataArrayMap = {
  [key in ModulationKey]: number;
};
