import { init_handler, change_config_handler, resizeHandler, transformData,col_rel_handler  } from './chart';
import * as basePlotset from "@plotset/base"
import * as devTools from "@plotset/dev-tools"
import * as plotset from "@plotset/common-scripts"

plotset.init();


window.init_handler = init_handler;
window.change_config_handler = change_config_handler;
window.resizeHandler = resizeHandler;
window.transformData = transformData;
window.col_rel_handler=col_rel_handler;
basePlotset.init()
if (process.env.NODE_ENV === "development") {
  window.addEventListener('load', () => {
    devTools.initDevTools()
  })
}