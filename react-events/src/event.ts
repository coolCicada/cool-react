const mp = new WeakMap();

export function addEvent(dom: Element | null, eventType: string, listener: Function) {
  if (!dom) return
  eventType = eventType.toLowerCase();
  mp.set(dom, {});
  mp.get(dom)[eventType] = listener;
  document.addEventListener(eventType.slice(2), dispatchEventSelf, false);
}

let syntheticEvent: any | null = null;

function dispatchEventSelf(event: Event) {
  let { type, target } = event;
  let eventType = 'on' + type;

  syntheticEvent = getSyntheticEvent(event); // 获取合成事件对象

  while (target) {
    const eventStore = mp.get(target);
    let listener = eventStore && eventStore[eventType];
    if (listener) {
      listener.call(target, syntheticEvent)
    }
    target = (target as any).parentNode;
  }

  for (let key in syntheticEvent) {
    if (Object.hasOwnProperty(key)) {
      delete syntheticEvent[key];
    }
  }
}

function getSyntheticEvent(nativeEvent: Event) {
  if (!syntheticEvent) {
    syntheticEvent = {};
    Object.getPrototypeOf(syntheticEvent).persist = persist;
  }

  syntheticEvent.nativeEvent = nativeEvent;
  syntheticEvent.currentTarget = nativeEvent.target;

  for (const key in nativeEvent) {
    const v = (nativeEvent as any)[key] as any;
    if (typeof v  === 'function') {
      syntheticEvent[key] = v.bind(nativeEvent)
    } else {
      syntheticEvent[key] = v
    }
  }

  return syntheticEvent;
}

function persist() {
  syntheticEvent = {};
  Object.getPrototypeOf(syntheticEvent).persist = persist;
}

if (module.hot) {
  module.hot.accept('./index.ts', function() {
    console.log('Accepting the updated printMe module!');
  })
}