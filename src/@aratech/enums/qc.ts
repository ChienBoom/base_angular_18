export const QcLevels = [
  {
    id: 1,
    name: 'Lv1 (L)',
    defaultColor: '#26a69a',
  },
  {
    id: 2,
    name: 'Lv2 (N)',
    defaultColor: '#2196f3',
  },
  {
    id: 3,
    name: 'Lv3 (H)',
    defaultColor: '#7b1fa2',
  },
];

// export const QcLevels = [
//   {
//     value: 1,
//     text: 'Lv1 (L)',
//     defaultColor: '#26a69a',
//   },
//   {
//     value: 2,
//     text: 'Lv2 (N)',
//     defaultColor: '#2196f3',
//   },
//   {
//     value: 3,
//     text: 'Lv3 (H)',
//     defaultColor: '#7b1fa2',
//   },
// ];

export const QcStatus = [
  {
    value: false,
    text: 'Không hoạt động',
  },
  {
    value: true,
    text: 'Hoạt động',
  },
];

export const QcErrorHistoryStatus = [
  {
    value: 1,
    text: 'Chưa khắc phục',
  },
  {
    value: 2,
    text: 'Đã khắc phục',
  },
];

export const QcReasonTypes = [
  {
    value: 1,
    text: 'Hệ thống',
  },
  {
    value: 2,
    text: 'Ngẫu nhiên',
  },
];

export const QcErrors = [
  {
    value: '1-2s',
    text: '1-2s',
  },
  {
    value: '1-3s',
    text: '1-3s',
  },
  {
    value: '2-2s',
    text: '2-2s',
  },
  {
    value: '2of3-2s',
    text: '2of3-2s',
  },
  {
    value: '4-1s',
    text: '4-1s',
  },
];

export const ErrorColors = {
  Warning: '#FFCC00',
  Rejected: '#B71C1C',
};

export const StarColors = [
  {
    value: 1,
    text: 'Qc.QcChart.QcLotChange',
    defaultColor: '#26a69a',
  },
  {
    value: 2,
    text: 'Qc.QcChart.HcLotChange',
    defaultColor: '#2196f3',
  },
  {
    value: 3,
    text: 'Qc.QcChart.CalibLineChange',
    defaultColor: '#7b1fa2',
  },
];

export const QcStandardView = [
  {
    value: 1,
    text: 'Qc.QcChart.ViewSupplierStandard',
  },
  {
    value: 2,
    text: 'Qc.QcChart.ViewLaboratoryStandard',
  },
];

export const QcRunTypeView = [
  {
    value: 1,
    text: 'Qc.QcChart.ViewByRuntime',
  },
  {
    value: 2,
    text: 'Qc.QcChart.ViewByRuntimeLevel',
  },
  {
    value: 0,
    text: 'Qc.QcChart.ViewByCount',
  },
];

export const QcResultView = [
  {
    value: 0,
    text: 'Qc.QcChart.OnlySelectedQcResult',
  },
  {
    value: 1,
    text: 'Qc.QcChart.AllQcResult',
  },
];

export const QcTypeLaws = [
  {
    id: 1,
    name: 'Luật cơ bản',
    laws: [
      {
        id: 1,
        name: '1-2s',
        option: 1,
      },
      {
        id: 2,
        name: '1-3s',
        option: 1,
      },
      {
        id: 3,
        name: '2-2s',
        option: 1,
      },
      {
        id: 4,
        name: '4-1s',
        option: 1,
      },
      {
        id: 5,
        name: '10x',
        option: 1,
      },
      {
        id: 6,
        name: 'R-4s',
        option: 1,
      },
    ],
  },
  {
    id: 2,
    name: 'Luật nâng cao',
    laws: [
      {
        id: 1,
        name: '2of3-2s',
        option: 1,
      },
      {
        id: 2,
        name: '3-1s',
        option: 1,
      },
      {
        id: 3,
        name: '12x',
        option: 1,
      },
      {
        id: 4,
        name: '9x',
        option: 1,
      },
      {
        id: 5,
        name: '8x',
        option: 1,
      },
      {
        id: 6,
        name: '6x',
        option: 1,
      },
      {
        id: 7,
        name: '7t',
        option: 1,
      },
      {
        id: 8,
        name: 'Shift',
        option: 1,
      },
      {
        id: 9,
        name: 'Trend',
        option: 1,
      },
    ],
  },
];
