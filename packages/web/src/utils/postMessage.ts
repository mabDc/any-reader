import EasyPostMessage, { type IAdapter, type IMessage } from 'easy-post-message';

if (typeof window.acquireVsCodeApi === 'function' && !window._acquireVsCodeApi) {
  window._acquireVsCodeApi = window.acquireVsCodeApi();
  window.acquireVsCodeApi = () => window._acquireVsCodeApi;
}

const VSCAdapter: IAdapter = () => {
  return {
    /**
     * 发送消息
     * @param target
     * @param data
     * @returns
     */
    postMessage: (target, data) => {
      console.log('[postMessage]', { target, data });
      window.acquireVsCodeApi().postMessage(data);
    },

    /**
     * 添加事件监听器
     * @param {Function} callback 回调函数
     * @returns {Function} 销毁监听器
     */
    addMessageListener: (callback: (arg: { data: IMessage; source: any }) => void): (() => void) => {
      const cb = (arg: any) => {
        callback({
          data: arg.data,
          source: window.acquireVsCodeApi() as Window
        });
      };
      window.addEventListener('message', cb);

      return () => {
        window.removeEventListener('message', cb);
      };
    }
  };
};

const pm = new EasyPostMessage(VSCAdapter);

export function postMessage(type: string, data: any) {
  pm.emit(type, JSON.parse(JSON.stringify(data)), window.acquireVsCodeApi());
}

export function sendMessage(type: string, data: any) {
  return pm.send(type, JSON.parse(JSON.stringify(data)), window.acquireVsCodeApi());
}

export function useMessage(type: string, cb: any) {
  const fn = (arg: any) => {
    console.log('[on]', { type, arg });
    cb(arg?.data);
  };
  pm.on(type, fn);
  onUnmounted(() => {
    pm.off(type, fn);
  });
}
