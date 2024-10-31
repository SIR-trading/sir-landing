import mitt from 'mitt'



type ApplicationEvents = {
  'sale:update': void;
};

export default defineNuxtPlugin(() => {
  const emitter = mitt<ApplicationEvents>()

  return {
    provide: {
      event: emitter.emit,
      listen: emitter.on
    }
  }
})

