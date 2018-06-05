class ServiceRegistry {
  constructor() {
    this._services = [];
    this._timeout = 30;
  }

  add = (intent, ip, port) => {
    const key = intent + ip + port;

    if (!this._services[key]) {
      this._services[key] = {};
    }
  }
}
