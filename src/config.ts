import { ReactShape } from "@antv/x6-react-shape";

ReactShape.config({
  width: 420,
  height: 80,
  shape: "react-shape",
  ports: {
    groups: {
      in: {position: "left", attrs: {circle: {stroke: '#31d0c6', magnet: true}}},
      out: {position: "right", attrs: {circle: {stroke: '#31d0c6', magnet: true}}},
    },
    items: [
      {id: "inputs", group: "in"}, 
      {id: "outputs",group: "out"},
    ]
  }
});
