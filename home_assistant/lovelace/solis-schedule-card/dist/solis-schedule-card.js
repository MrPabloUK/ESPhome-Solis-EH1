/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const V = globalThis, X = V.ShadowRoot && (V.ShadyCSS === void 0 || V.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Q = Symbol(), st = /* @__PURE__ */ new WeakMap();
let mt = class {
  constructor(t, r, s) {
    if (this._$cssResult$ = !0, s !== Q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = r;
  }
  get styleSheet() {
    let t = this.o;
    const r = this.t;
    if (X && t === void 0) {
      const s = r !== void 0 && r.length === 1;
      s && (t = st.get(r)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && st.set(r, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Et = (e) => new mt(typeof e == "string" ? e : e + "", void 0, Q), $t = (e, ...t) => {
  const r = e.length === 1 ? e[0] : t.reduce((s, i, o) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + e[o + 1], e[0]);
  return new mt(r, e, Q);
}, Pt = (e, t) => {
  if (X) e.adoptedStyleSheets = t.map((r) => r instanceof CSSStyleSheet ? r : r.styleSheet);
  else for (const r of t) {
    const s = document.createElement("style"), i = V.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = r.cssText, e.appendChild(s);
  }
}, it = X ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let r = "";
  for (const s of t.cssRules) r += s.cssText;
  return Et(r);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Mt, defineProperty: Dt, getOwnPropertyDescriptor: kt, getOwnPropertyNames: Ct, getOwnPropertySymbols: Ot, getPrototypeOf: Tt } = Object, y = globalThis, ot = y.trustedTypes, Nt = ot ? ot.emptyScript : "", Ut = y.reactiveElementPolyfillSupport, N = (e, t) => e, Y = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Nt : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let r = e;
  switch (t) {
    case Boolean:
      r = e !== null;
      break;
    case Number:
      r = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        r = JSON.parse(e);
      } catch {
        r = null;
      }
  }
  return r;
} }, tt = (e, t) => !Mt(e, t), nt = { attribute: !0, type: String, converter: Y, reflect: !1, useDefault: !1, hasChanged: tt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), y.litPropertyMetadata ?? (y.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let P = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, r = nt) {
    if (r.state && (r.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((r = Object.create(r)).wrapped = !0), this.elementProperties.set(t, r), !r.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, r);
      i !== void 0 && Dt(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, r, s) {
    const { get: i, set: o } = kt(this.prototype, t) ?? { get() {
      return this[r];
    }, set(n) {
      this[r] = n;
    } };
    return { get: i, set(n) {
      const d = i?.call(this);
      o?.call(this, n), this.requestUpdate(t, d, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? nt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(N("elementProperties"))) return;
    const t = Tt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(N("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(N("properties"))) {
      const r = this.properties, s = [...Ct(r), ...Ot(r)];
      for (const i of s) this.createProperty(i, r[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const r = litPropertyMetadata.get(t);
      if (r !== void 0) for (const [s, i] of r) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [r, s] of this.elementProperties) {
      const i = this._$Eu(r, s);
      i !== void 0 && this._$Eh.set(i, r);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const r = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s) r.unshift(it(i));
    } else t !== void 0 && r.push(it(t));
    return r;
  }
  static _$Eu(t, r) {
    const s = r.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), r = this.constructor.elementProperties;
    for (const s of r.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Pt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, r, s) {
    this._$AK(t, s);
  }
  _$ET(t, r) {
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const o = (s.converter?.toAttribute !== void 0 ? s.converter : Y).toAttribute(r, s.type);
      this._$Em = t, o == null ? this.removeAttribute(i) : this.setAttribute(i, o), this._$Em = null;
    }
  }
  _$AK(t, r) {
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const o = s.getPropertyOptions(i), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : Y;
      this._$Em = i;
      const d = n.fromAttribute(r, o.type);
      this[i] = d ?? this._$Ej?.get(i) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, r, s, i = !1, o) {
    if (t !== void 0) {
      const n = this.constructor;
      if (i === !1 && (o = this[t]), s ?? (s = n.getPropertyOptions(t)), !((s.hasChanged ?? tt)(o, r) || s.useDefault && s.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, s)))) return;
      this.C(t, r, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, r, { useDefault: s, reflect: i, wrapped: o }, n) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, n ?? r ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (r = void 0), this._$AL.set(t, r)), i === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (r) {
      Promise.reject(r);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [i, o] of this._$Ep) this[i] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [i, o] of s) {
        const { wrapped: n } = o, d = this[i];
        n !== !0 || this._$AL.has(i) || d === void 0 || this.C(i, void 0, o, d);
      }
    }
    let t = !1;
    const r = this._$AL;
    try {
      t = this.shouldUpdate(r), t ? (this.willUpdate(r), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(r)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(r);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((r) => r.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((r) => this._$ET(r, this[r]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
P.elementStyles = [], P.shadowRootOptions = { mode: "open" }, P[N("elementProperties")] = /* @__PURE__ */ new Map(), P[N("finalized")] = /* @__PURE__ */ new Map(), Ut?.({ ReactiveElement: P }), (y.reactiveElementVersions ?? (y.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = globalThis, at = (e) => e, J = U.trustedTypes, lt = J ? J.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, vt = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, bt = "?" + v, Rt = `<${bt}>`, E = document, j = () => E.createComment(""), L = (e) => e === null || typeof e != "object" && typeof e != "function", et = Array.isArray, Ht = (e) => et(e) || typeof e?.[Symbol.iterator] == "function", G = `[ 	
\f\r]`, T = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ct = /-->/g, dt = />/g, S = RegExp(`>|${G}(?:([^\\s"'>=/]+)(${G}*=${G}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), pt = /'/g, ht = /"/g, yt = /^(?:script|style|textarea|title)$/i, zt = (e) => (t, ...r) => ({ _$litType$: e, strings: t, values: r }), l = zt(1), k = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), ut = /* @__PURE__ */ new WeakMap(), A = E.createTreeWalker(E, 129);
function xt(e, t) {
  if (!et(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return lt !== void 0 ? lt.createHTML(t) : t;
}
const jt = (e, t) => {
  const r = e.length - 1, s = [];
  let i, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = T;
  for (let d = 0; d < r; d++) {
    const a = e[d];
    let h, u, p = -1, m = 0;
    for (; m < a.length && (n.lastIndex = m, u = n.exec(a), u !== null); ) m = n.lastIndex, n === T ? u[1] === "!--" ? n = ct : u[1] !== void 0 ? n = dt : u[2] !== void 0 ? (yt.test(u[2]) && (i = RegExp("</" + u[2], "g")), n = S) : u[3] !== void 0 && (n = S) : n === S ? u[0] === ">" ? (n = i ?? T, p = -1) : u[1] === void 0 ? p = -2 : (p = n.lastIndex - u[2].length, h = u[1], n = u[3] === void 0 ? S : u[3] === '"' ? ht : pt) : n === ht || n === pt ? n = S : n === ct || n === dt ? n = T : (n = S, i = void 0);
    const $ = n === S && e[d + 1].startsWith("/>") ? " " : "";
    o += n === T ? a + Rt : p >= 0 ? (s.push(h), a.slice(0, p) + vt + a.slice(p) + v + $) : a + v + (p === -2 ? d : $);
  }
  return [xt(e, o + (e[r] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class B {
  constructor({ strings: t, _$litType$: r }, s) {
    let i;
    this.parts = [];
    let o = 0, n = 0;
    const d = t.length - 1, a = this.parts, [h, u] = jt(t, r);
    if (this.el = B.createElement(h, s), A.currentNode = this.el.content, r === 2 || r === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (i = A.nextNode()) !== null && a.length < d; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const p of i.getAttributeNames()) if (p.endsWith(vt)) {
          const m = u[n++], $ = i.getAttribute(p).split(v), F = /([.?@])?(.*)/.exec(m);
          a.push({ type: 1, index: o, name: F[2], strings: $, ctor: F[1] === "." ? Bt : F[1] === "?" ? It : F[1] === "@" ? Wt : Z }), i.removeAttribute(p);
        } else p.startsWith(v) && (a.push({ type: 6, index: o }), i.removeAttribute(p));
        if (yt.test(i.tagName)) {
          const p = i.textContent.split(v), m = p.length - 1;
          if (m > 0) {
            i.textContent = J ? J.emptyScript : "";
            for (let $ = 0; $ < m; $++) i.append(p[$], j()), A.nextNode(), a.push({ type: 2, index: ++o });
            i.append(p[m], j());
          }
        }
      } else if (i.nodeType === 8) if (i.data === bt) a.push({ type: 2, index: o });
      else {
        let p = -1;
        for (; (p = i.data.indexOf(v, p + 1)) !== -1; ) a.push({ type: 7, index: o }), p += v.length - 1;
      }
      o++;
    }
  }
  static createElement(t, r) {
    const s = E.createElement("template");
    return s.innerHTML = t, s;
  }
}
function C(e, t, r = e, s) {
  if (t === k) return t;
  let i = s !== void 0 ? r._$Co?.[s] : r._$Cl;
  const o = L(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== o && (i?._$AO?.(!1), o === void 0 ? i = void 0 : (i = new o(e), i._$AT(e, r, s)), s !== void 0 ? (r._$Co ?? (r._$Co = []))[s] = i : r._$Cl = i), i !== void 0 && (t = C(e, i._$AS(e, t.values), i, s)), t;
}
class Lt {
  constructor(t, r) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = r;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: r }, parts: s } = this._$AD, i = (t?.creationScope ?? E).importNode(r, !0);
    A.currentNode = i;
    let o = A.nextNode(), n = 0, d = 0, a = s[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let h;
        a.type === 2 ? h = new W(o, o.nextSibling, this, t) : a.type === 1 ? h = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (h = new qt(o, this, t)), this._$AV.push(h), a = s[++d];
      }
      n !== a?.index && (o = A.nextNode(), n++);
    }
    return A.currentNode = E, i;
  }
  p(t) {
    let r = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, r), r += s.strings.length - 2) : s._$AI(t[r])), r++;
  }
}
class W {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, r, s, i) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = t, this._$AB = r, this._$AM = s, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const r = this._$AM;
    return r !== void 0 && t?.nodeType === 11 && (t = r.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, r = this) {
    t = C(this, t, r), L(t) ? t === c || t == null || t === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : t !== this._$AH && t !== k && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ht(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== c && L(this._$AH) ? this._$AA.nextSibling.data = t : this.T(E.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: r, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = B.createElement(xt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === i) this._$AH.p(r);
    else {
      const o = new Lt(i, this), n = o.u(this.options);
      o.p(r), this.T(n), this._$AH = o;
    }
  }
  _$AC(t) {
    let r = ut.get(t.strings);
    return r === void 0 && ut.set(t.strings, r = new B(t)), r;
  }
  k(t) {
    et(this._$AH) || (this._$AH = [], this._$AR());
    const r = this._$AH;
    let s, i = 0;
    for (const o of t) i === r.length ? r.push(s = new W(this.O(j()), this.O(j()), this, this.options)) : s = r[i], s._$AI(o), i++;
    i < r.length && (this._$AR(s && s._$AB.nextSibling, i), r.length = i);
  }
  _$AR(t = this._$AA.nextSibling, r) {
    for (this._$AP?.(!1, !0, r); t !== this._$AB; ) {
      const s = at(t).nextSibling;
      at(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class Z {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, r, s, i, o) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = t, this.name = r, this._$AM = i, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = c;
  }
  _$AI(t, r = this, s, i) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = C(this, t, r, 0), n = !L(t) || t !== this._$AH && t !== k, n && (this._$AH = t);
    else {
      const d = t;
      let a, h;
      for (t = o[0], a = 0; a < o.length - 1; a++) h = C(this, d[s + a], r, a), h === k && (h = this._$AH[a]), n || (n = !L(h) || h !== this._$AH[a]), h === c ? t = c : t !== c && (t += (h ?? "") + o[a + 1]), this._$AH[a] = h;
    }
    n && !i && this.j(t);
  }
  j(t) {
    t === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Bt extends Z {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === c ? void 0 : t;
  }
}
class It extends Z {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== c);
  }
}
class Wt extends Z {
  constructor(t, r, s, i, o) {
    super(t, r, s, i, o), this.type = 5;
  }
  _$AI(t, r = this) {
    if ((t = C(this, t, r, 0) ?? c) === k) return;
    const s = this._$AH, i = t === c && s !== c || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== c && (s === c || i);
    i && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class qt {
  constructor(t, r, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = r, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    C(this, t);
  }
}
const Ft = U.litHtmlPolyfillSupport;
Ft?.(B, W), (U.litHtmlVersions ?? (U.litHtmlVersions = [])).push("3.3.3");
const Vt = (e, t, r) => {
  const s = r?.renderBefore ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const o = r?.renderBefore ?? null;
    s._$litPart$ = i = new W(t.insertBefore(j(), o), o, void 0, r ?? {});
  }
  return i._$AI(e), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R = globalThis;
class M extends P {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var r;
    const t = super.createRenderRoot();
    return (r = this.renderOptions).renderBefore ?? (r.renderBefore = t.firstChild), t;
  }
  update(t) {
    const r = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Vt(r, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return k;
  }
}
M._$litElement$ = !0, M.finalized = !0, R.litElementHydrateSupport?.({ LitElement: M });
const Yt = R.litElementPolyfillSupport;
Yt?.({ LitElement: M });
(R.litElementVersions ?? (R.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const St = (e) => (t, r) => {
  r !== void 0 ? r.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Jt = { attribute: !0, type: String, converter: Y, reflect: !1, hasChanged: tt }, Zt = (e = Jt, t, r) => {
  const { kind: s, metadata: i } = r;
  let o = globalThis.litPropertyMetadata.get(i);
  if (o === void 0 && globalThis.litPropertyMetadata.set(i, o = /* @__PURE__ */ new Map()), s === "setter" && ((e = Object.create(e)).wrapped = !0), o.set(r.name, e), s === "accessor") {
    const { name: n } = r;
    return { set(d) {
      const a = t.get.call(this);
      t.set.call(this, d), this.requestUpdate(n, a, e, !0, d);
    }, init(d) {
      return d !== void 0 && this.C(n, void 0, e, d), d;
    } };
  }
  if (s === "setter") {
    const { name: n } = r;
    return function(d) {
      const a = this[n];
      t.call(this, d), this.requestUpdate(n, a, e, !0, d);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function Gt(e) {
  return (t, r) => typeof r == "object" ? Zt(e, t, r) : ((s, i, o) => {
    const n = i.hasOwnProperty(o);
    return i.constructor.createProperty(o, s), n ? Object.getOwnPropertyDescriptor(i, o) : void 0;
  })(e, t, r);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function _(e) {
  return Gt({ ...e, state: !0, attribute: !1 });
}
const q = 0, x = 1, w = 2, b = 3, Kt = 12, ft = 6e3, Xt = ["M", "T", "W", "T", "F", "S", "S"], Qt = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
function te(e, t) {
  const r = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return e === 2 && (t % 4 === 0 && t % 100 !== 0 || t % 400 === 0) ? 29 : r[e] ?? 0;
}
function At(e) {
  if (e <= 0) return !1;
  const t = Math.floor(e / 1e4), r = Math.floor(e / 100) % 100, s = e % 100;
  return t < 2020 || t > 2100 || r < 1 || r > 12 || s < 1 ? !1 : s <= te(r, t);
}
function H(e) {
  if (!At(e)) return "";
  const t = Math.floor(e / 1e4), r = Math.floor(e / 100) % 100, s = e % 100;
  return `${t}-${String(r).padStart(2, "0")}-${String(s).padStart(2, "0")}`;
}
function z(e) {
  const t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e.trim());
  if (!t) return 0;
  const r = Number(t[1]) * 1e4 + Number(t[2]) * 100 + Number(t[3]);
  return At(r) ? r : 0;
}
function ee(e) {
  const t = [];
  for (let r = 0; r < 7; r++)
    e & 1 << r && t.push(r);
  return t;
}
function wt(e) {
  return e.reduce((t, r) => r >= 0 && r <= 6 ? t | 1 << r : t, 0);
}
function re(e) {
  return Xt.map((t, r) => (e & 1 << r) !== 0 ? t : "·").join("");
}
function O(e) {
  const t = /^(\d{1,2}):(\d{2})$/.exec((e || "").trim());
  if (!t) return null;
  const r = Number(t[1]), s = Number(t[2]);
  return r < 0 || r > 23 || s < 0 || s > 59 ? null : { hour: r, minute: s };
}
function _t(e, t) {
  const r = O(e), s = O(t);
  return !r || !s ? !1 : r.hour * 60 + r.minute > s.hour * 60 + s.minute;
}
function se(e) {
  return e > 0 ? `${e} W` : "Unlimited";
}
function D(e) {
  return e ? e.Mode === "Idle" || e.Mode === "" || !e.Mode : !0;
}
function ie(e) {
  return D(e) ? "empty" : e["Paused By Target"] ? "auto-paused" : e.Active ? "active" : "paused";
}
function oe(e) {
  switch (e) {
    case "active":
      return "Active";
    case "paused":
      return "Paused";
    case "auto-paused":
      return "Auto-paused";
    default:
      return "Empty";
  }
}
function ne(e) {
  const t = e["Repeat Mode"] ?? 0;
  if (t === x) return re(e["Selected Days"] ?? 0);
  if (t === w) return H(e["Date Start"] ?? 0) || String(e["Date Start"] ?? "");
  if (t === b) {
    const r = H(e["Date Start"] ?? 0) || String(e["Date Start"] ?? ""), s = H(e["Date End"] ?? 0) || String(e["Date End"] ?? "");
    return `${r}–${s}`;
  }
  return "Daily";
}
function gt(e) {
  return JSON.stringify(e);
}
function ae(e) {
  const t = D(e);
  return {
    slot: e.Slot,
    operationMode: e.Mode === "Discharge" ? 2 : 1,
    start: t ? "00:00" : e["Start Time"] || "00:00",
    end: t ? "00:00" : e["End Time"] || "00:00",
    targetSoc: t ? 100 : Number(e["Target SOC"] ?? 100),
    power: t ? 0 : Number(e.Power ?? 0),
    repeatMode: t ? q : e["Repeat Mode"] ?? 0,
    selectedDays: ee(e["Selected Days"] ?? 0),
    dateStart: H(e["Date Start"] ?? 0),
    dateEnd: H(e["Date End"] ?? 0),
    autoPause: !!e["Auto Pause"]
  };
}
function le(e) {
  return {
    slot: e,
    operationMode: 1,
    start: "00:00",
    end: "00:00",
    targetSoc: 100,
    power: 0,
    repeatMode: q,
    selectedDays: [],
    dateStart: "",
    dateEnd: "",
    autoPause: !1
  };
}
function ce(e) {
  if (e.slot < 1 || e.slot > 12) return "Slot must be 1-12.";
  if (e.operationMode !== 1 && e.operationMode !== 2) return "Choose Charge or Discharge.";
  if (!O(e.start)) return "Start time must be HH:MM.";
  if (!O(e.end)) return "End time must be HH:MM.";
  if (e.targetSoc < 0 || e.targetSoc > 100) return "Target SOC must be 0-100.";
  if (e.power < 0 || e.power > ft) return `Power must be 0-${ft}.`;
  if (![q, x, w, b].includes(e.repeatMode))
    return "Invalid repeat mode.";
  if (e.repeatMode === x) {
    const t = wt(e.selectedDays);
    if (t < 1 || t > 127) return "Select at least one day.";
  }
  if (e.repeatMode === w && !z(e.dateStart))
    return "Once requires a valid start date.";
  if (e.repeatMode === b) {
    const t = z(e.dateStart), r = z(e.dateEnd);
    if (!t || !r) return "Date range requires a start and end date.";
    if (t > r) return "Date range start must be on or before the end date.";
  }
  return null;
}
function de(e) {
  const t = O(e.start), r = O(e.end), s = wt(e.selectedDays);
  return {
    Slot_Number: e.slot,
    Operation_Mode: e.operationMode,
    Start_Hour: t.hour,
    Start_Minute: t.minute,
    End_Hour: r.hour,
    End_Minute: r.minute,
    Target_SOC_Percent: e.targetSoc,
    Power_Limit_Watts: e.power,
    Repeat_Daily: e.repeatMode !== w,
    Repeat_Mode: e.repeatMode,
    Selected_Days: e.repeatMode === x ? s : 0,
    Date_Start: e.repeatMode === q || e.repeatMode === x ? 0 : z(e.dateStart),
    Date_End: e.repeatMode === b ? z(e.dateEnd) : 0,
    Auto_Pause_On_Target: e.autoPause
  };
}
function K(e) {
  return new Set(e.filter((t) => !D(t)).map((t) => t.Slot));
}
function pe(e) {
  const t = K(e);
  for (let r = 1; r <= 12; r++)
    if (!t.has(r)) return r;
  return null;
}
function he(e) {
  return Array.isArray(e) ? e.map((t, r) => {
    const s = t;
    return {
      Slot: Number(s.Slot ?? r + 1),
      Active: !!s.Active,
      Mode: String(s.Mode ?? "Idle"),
      "Start Time": String(s["Start Time"] ?? "00:00"),
      "End Time": String(s["End Time"] ?? "00:00"),
      "Target SOC": Number(s["Target SOC"] ?? 0),
      Power: Number(s.Power ?? 0),
      Repeat: !!s.Repeat,
      "Repeat Mode": Number(s["Repeat Mode"] ?? 0),
      "Selected Days": Number(s["Selected Days"] ?? 0),
      "Date Start": Number(s["Date Start"] ?? 0),
      "Date End": Number(s["Date End"] ?? 0),
      "Auto Pause": !!s["Auto Pause"],
      "Paused By Target": !!s["Paused By Target"]
    };
  }) : [];
}
const ue = $t`
  :host {
    display: block;
  }

  ha-card {
    padding: 12px 12px 8px;
  }

  .header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
  }

  .title {
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--primary-text-color);
  }

  .updated {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
  }

  .empty-state,
  .error {
    padding: 16px 4px;
    color: var(--secondary-text-color);
  }

  .error {
    color: var(--error-color, #db4437);
  }

  .rows {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .row {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 10px;
    align-items: center;
    padding: 10px;
    border-radius: 12px;
    background: var(--secondary-background-color, rgba(255, 255, 255, 0.04));
    cursor: pointer;
    border: 1px solid transparent;
  }

  .row:hover,
  .row:focus-visible {
    border-color: var(--divider-color);
    outline: none;
  }

  .badge {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: grid;
    place-items: center;
    font-weight: 600;
    font-size: 0.85rem;
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }

  .body {
    min-width: 0;
  }

  .line1 {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 8px;
  }

  .mode {
    font-weight: 600;
  }

  .mode.charge {
    color: var(--primary-color);
  }

  .mode.discharge {
    color: var(--accent-color, #ff9800);
  }

  .window {
    color: var(--primary-text-color);
  }

  .overnight {
    font-size: 0.7rem;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .line2 {
    margin-top: 4px;
    font-size: 0.85rem;
    color: var(--secondary-text-color);
    display: flex;
    flex-wrap: wrap;
    gap: 6px 10px;
    align-items: center;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    border-radius: 999px;
    padding: 1px 8px;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .chip.active {
    background: rgba(56, 142, 60, 0.2);
    color: #81c784;
  }

  .chip.paused {
    background: rgba(255, 193, 7, 0.15);
    color: #ffcc80;
  }

  .chip.auto-paused {
    background: rgba(33, 150, 243, 0.15);
    color: #90caf9;
  }

  .days {
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.08em;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  button.icon {
    appearance: none;
    border: 0;
    background: transparent;
    color: var(--secondary-text-color);
    min-height: 32px;
    padding: 4px 8px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1;
  }

  button.icon:hover,
  button.icon:focus-visible {
    background: rgba(255, 255, 255, 0.08);
    color: var(--primary-text-color);
  }

  .add,
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: 10px;
  }

  .hint {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
  }

  button.link,
  button.primary,
  button.danger,
  button.ghost {
    appearance: none;
    border: 0;
    cursor: pointer;
    border-radius: 8px;
    padding: 8px 12px;
    font: inherit;
  }

  button.link,
  button.ghost {
    background: transparent;
    color: var(--primary-color);
  }

  button.danger {
    background: transparent;
    color: var(--error-color, #db4437);
  }

  button.primary {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }

  button:disabled {
    opacity: 0.5;
    cursor: default;
  }

  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    z-index: 8;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  @media (min-width: 640px) {
    .overlay {
      align-items: center;
    }
  }

  .dialog {
    width: min(520px, 100%);
    max-height: 100%;
    overflow: auto;
    background: var(--card-background-color, #1c1d22);
    color: var(--primary-text-color);
    border-radius: 16px 16px 0 0;
    padding: 16px;
    box-shadow: var(--ha-card-box-shadow, none);
  }

  @media (min-width: 640px) {
    .dialog {
      border-radius: 16px;
    }
  }

  .dialog h2,
  .dialog-title {
    margin: 0 0 12px;
    font-size: 1.15rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .slot-picker {
    position: relative;
    display: inline-block;
  }

  .slot-badge {
    appearance: none;
    min-width: 36px;
    height: 32px;
    padding: 0 8px;
    border: 0;
    border-radius: 8px;
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }

  .slot-popover {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    z-index: 2;
    display: grid;
    grid-template-columns: repeat(4, 36px);
    gap: 6px;
    padding: 8px;
    border-radius: 12px;
    background: var(--card-background-color, #1c1d22);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
    border: 1px solid var(--divider-color);
  }

  .slot-cell {
    appearance: none;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1px solid var(--divider-color);
    background: transparent;
    color: var(--primary-text-color);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }

  .slot-cell.selected {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }

  .slot-cell.in-use,
  .slot-cell:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .banner {
    background: rgba(255, 193, 7, 0.12);
    color: var(--primary-text-color);
    border-radius: 8px;
    padding: 8px 10px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    gap: 8px;
    align-items: center;
    font-size: 0.85rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 12px;
  }

  .field label {
    font-size: 0.8rem;
    color: var(--secondary-text-color);
  }

  .row-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .segmented {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .segmented button {
    appearance: none;
    border: 1px solid var(--divider-color);
    background: transparent;
    color: var(--primary-text-color);
    border-radius: 999px;
    padding: 6px 10px;
    cursor: pointer;
    font: inherit;
  }

  .segmented button[aria-pressed="true"] {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }

  input[type="time"],
  input[type="date"],
  input[type="number"],
  select {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid var(--divider-color);
    background: var(--input-fill-color, transparent);
    color: var(--primary-text-color);
    border-radius: 8px;
    padding: 8px;
    font: inherit;
  }

  .help {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
  }

  .dialog-error {
    color: var(--error-color, #db4437);
    font-size: 0.85rem;
    margin-bottom: 8px;
  }

  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 8px;
  }

  .switch {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .switch input {
    width: auto;
  }
`, fe = $t`
  .form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 0.85rem;
    color: var(--primary-text-color);
  }

  input {
    border: 1px solid var(--divider-color);
    background: var(--input-fill-color, transparent);
    color: var(--primary-text-color);
    border-radius: 8px;
    padding: 8px;
    font: inherit;
  }
`;
var _e = Object.defineProperty, ge = Object.getOwnPropertyDescriptor, g = (e, t, r, s) => {
  for (var i = s > 1 ? void 0 : s ? ge(t, r) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (i = (s ? n(t, r, i) : n(i)) || i);
  return s && i && _e(t, r, i), i;
};
let f = class extends M {
  constructor() {
    super(...arguments), this._draft = null, this._draftWasOccupied = !1, this._openedFingerprint = "", this._stale = !1, this._busy = !1, this._error = "", this._confirmDeleteAll = !1, this._menuSlot = null, this._slotPickerOpen = !1;
  }
  static getStubConfig() {
    return {
      entity: "sensor.solis_master_schedule",
      device_prefix: "solisinverter_inverter1"
    };
  }
  static getConfigElement() {
    return document.createElement("solis-schedule-card-editor");
  }
  setConfig(e) {
    if (!e?.entity) throw new Error("entity is required");
    if (!e.device_prefix) throw new Error("device_prefix is required");
    this._config = e;
  }
  set hass(e) {
    if (this._hass = e, this._draft) {
      const t = this._slotByNumber(this._draft.slot), r = t ? gt(t) : "";
      this._stale = r !== this._openedFingerprint;
    }
  }
  getCardSize() {
    return 6;
  }
  get _slots() {
    const e = this._hass?.states[this._config?.entity ?? ""];
    return he(e?.attributes.data);
  }
  get _occupied() {
    const e = this._slots;
    return this._config?.show_empty ? e : e.filter((t) => !D(t));
  }
  _slotByNumber(e) {
    return this._slots.find((t) => t.Slot === e);
  }
  _service(e) {
    return `${this._config.device_prefix}_${e}`;
  }
  async _call(e, t) {
    if (this._hass) {
      this._busy = !0, this._error = "";
      try {
        await this._hass.callService("esphome", e, t);
      } catch (r) {
        this._error = r instanceof Error ? r.message : "Home Assistant action failed.";
      } finally {
        this._busy = !1;
      }
    }
  }
  _openEditor(e) {
    const t = this._slotByNumber(e);
    this._draftWasOccupied = !!(t && !D(t)), this._draft = t && !D(t) ? ae(t) : le(e), this._openedFingerprint = t ? gt(t) : "", this._stale = !1, this._error = "", this._menuSlot = null, this._slotPickerOpen = !1;
  }
  _closeEditor() {
    this._draft = null, this._stale = !1, this._error = "", this._slotPickerOpen = !1;
  }
  _reloadDraft() {
    this._draft && this._openEditor(this._draft.slot);
  }
  _addSlot() {
    const e = pe(this._slots);
    if (e == null) {
      this._error = "All 12 slots are in use.";
      return;
    }
    this._openEditor(e);
  }
  async _save() {
    if (!this._draft) return;
    const e = ce(this._draft);
    if (e) {
      this._error = e;
      return;
    }
    await this._call(this._service("upsert_schedule"), de(this._draft)), this._error || this._closeEditor();
  }
  async _manage(e, t) {
    this._menuSlot = null, await this._call(this._service("manage_slot_status"), {
      Slot_Number: e,
      Instruction: t
    }), t === 0 && this._draft?.slot === e && this._closeEditor();
  }
  async _deleteAll() {
    await this._call(this._service("delete_all_schedules")), this._confirmDeleteAll = !1, this._closeEditor();
  }
  _patchDraft(e) {
    this._draft && (this._draft = { ...this._draft, ...e });
  }
  _toggleDay(e) {
    if (!this._draft) return;
    const t = new Set(this._draft.selectedDays);
    t.has(e) ? t.delete(e) : t.add(e), this._patchDraft({ selectedDays: [...t].sort((r, s) => r - s) });
  }
  _autoPauseHelp(e) {
    return e === w ? "Once slots are deleted after the time window ends." : "Slot resumes after the time window ends.";
  }
  _renderWhen(e) {
    const t = ne(e);
    return (e["Repeat Mode"] ?? 0) === x ? l`<span class="days" title="Selected days">${t}</span>` : l`<span>${t}</span>`;
  }
  _renderRow(e) {
    const t = ie(e), r = _t(e["Start Time"], e["End Time"]);
    return l`
      <div
        class="row"
        role="button"
        tabindex="0"
        @click=${() => this._openEditor(e.Slot)}
        @keydown=${(s) => {
      (s.key === "Enter" || s.key === " ") && (s.preventDefault(), this._openEditor(e.Slot));
    }}
      >
        <div class="badge">${e.Slot}</div>
        <div class="body">
          <div class="line1">
            <span class="chip ${t}">${oe(t)}</span>
            <span class="mode ${e.Mode.toLowerCase()}">${e.Mode}</span>
            <span class="window">${e["Start Time"]} – ${e["End Time"]}</span>
            ${r ? l`<span class="overnight">Overnight</span>` : c}
          </div>
          <div class="line2">
            ${this._renderWhen(e)}
            <span>SOC ${e["Target SOC"]}%</span>
            <span>${se(e.Power)}</span>
            ${e["Auto Pause"] ? l`<span>Auto-pause</span>` : c}
          </div>
        </div>
        <div class="actions" @click=${(s) => s.stopPropagation()}>
          ${t === "active" ? l`<button class="icon" title="Pause" @click=${() => this._manage(e.Slot, 1)}>Pause</button>` : l`<button class="icon" title="Resume" @click=${() => this._manage(e.Slot, 2)}>Go</button>`}
          <button
            class="icon"
            title="More"
            @click=${() => this._menuSlot = this._menuSlot === e.Slot ? null : e.Slot}
          >
            More
          </button>
        </div>
      </div>
      ${this._menuSlot === e.Slot ? l`
            <div class="actions" style="justify-content: flex-end">
              <button class="ghost" @click=${() => this._openEditor(e.Slot)}>Edit</button>
              <button class="ghost" @click=${() => this._manage(e.Slot, t === "active" ? 1 : 2)}>
                ${t === "active" ? "Pause" : "Resume"}
              </button>
              <button class="danger" @click=${() => this._manage(e.Slot, 0)}>Delete</button>
            </div>
          ` : c}
    `;
  }
  _chooseSlot(e) {
    K(this._slots).has(e) || (this._patchDraft({ slot: e }), this._slotPickerOpen = !1);
  }
  _renderSlotPicker(e) {
    if (this._draftWasOccupied) return c;
    const t = K(this._slots);
    return l`
      <div class="slot-picker">
        <button
          class="slot-badge"
          type="button"
          aria-expanded=${this._slotPickerOpen}
          aria-haspopup="listbox"
          title="Change slot"
          @click=${(r) => {
      r.stopPropagation(), this._slotPickerOpen = !this._slotPickerOpen;
    }}
        >
          ${e.slot}
        </button>
        ${this._slotPickerOpen ? l`
              <div class="slot-popover" role="listbox" aria-label="Choose slot" @click=${(r) => r.stopPropagation()}>
                ${Array.from({ length: Kt }, (r, s) => s + 1).map((r) => {
      const s = t.has(r), i = r === e.slot;
      return l`
                    <button
                      type="button"
                      role="option"
                      class="slot-cell ${i ? "selected" : ""} ${s ? "in-use" : ""}"
                      aria-selected=${i}
                      ?disabled=${s}
                      @click=${() => this._chooseSlot(r)}
                    >
                      ${r}
                    </button>
                  `;
    })}
              </div>
            ` : c}
      </div>
    `;
  }
  _renderEditor() {
    const e = this._draft;
    return e ? l`
      <div class="overlay" @click=${() => this._closeEditor()}>
        <div
          class="dialog"
          @click=${(t) => {
      t.stopPropagation(), this._slotPickerOpen = !1;
    }}
        >
          <h2 class="dialog-title">
            ${this._draftWasOccupied ? `Edit slot ${e.slot}` : l`Add slot ${this._renderSlotPicker(e)}`}
          </h2>
          ${this._stale ? l`
                <div class="banner">
                  <span>Slot changed on device.</span>
                  <button class="link" @click=${() => this._reloadDraft()}>Reload</button>
                </div>
              ` : c}
          ${this._error ? l`<div class="dialog-error">${this._error}</div>` : c}

          <div class="field">
            <label>Mode</label>
            <div class="segmented">
              <button
                aria-pressed=${e.operationMode === 1}
                @click=${() => this._patchDraft({ operationMode: 1 })}
              >
                Charge
              </button>
              <button
                aria-pressed=${e.operationMode === 2}
                @click=${() => this._patchDraft({ operationMode: 2 })}
              >
                Discharge
              </button>
            </div>
          </div>

          <div class="row-fields">
            <div class="field">
              <label>Start</label>
              <input
                type="time"
                .value=${e.start}
                @change=${(t) => this._patchDraft({ start: t.target.value })}
              />
            </div>
            <div class="field">
              <label>End</label>
              <input
                type="time"
                .value=${e.end}
                @change=${(t) => this._patchDraft({ end: t.target.value })}
              />
            </div>
          </div>
          ${_t(e.start, e.end) ? l`<div class="help" style="margin-top:-8px;margin-bottom:12px">Overnight window: stays on the start day after midnight.</div>` : c}

          <div class="row-fields">
            <div class="field">
              <label>Target SOC (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                .value=${String(e.targetSoc)}
                @change=${(t) => this._patchDraft({ targetSoc: Number(t.target.value) })}
              />
            </div>
            <div class="field">
              <label>Power (W)</label>
              <input
                type="number"
                min="0"
                max="6000"
                .value=${String(e.power)}
                @change=${(t) => this._patchDraft({ power: Number(t.target.value) })}
              />
              <span class="help">0 = unlimited</span>
            </div>
          </div>

          <div class="field">
            <label>Repeat</label>
            <div class="segmented">
              ${[
      [q, "Daily"],
      [x, "Selected days"],
      [w, "Once"],
      [b, "Date range"]
    ].map(
      ([t, r]) => l`
                  <button
                    aria-pressed=${e.repeatMode === t}
                    @click=${() => this._patchDraft({ repeatMode: t })}
                  >
                    ${r}
                  </button>
                `
    )}
            </div>
          </div>

          ${e.repeatMode === x ? l`
                <div class="field">
                  <label>Days</label>
                  <div class="segmented" role="group" aria-label="Days">
                    ${Qt.map(
      (t, r) => l`
                        <button
                          aria-pressed=${e.selectedDays.includes(r)}
                          @click=${() => this._toggleDay(r)}
                        >
                          ${t}
                        </button>
                      `
    )}
                  </div>
                </div>
              ` : c}

          ${e.repeatMode === w || e.repeatMode === b ? l`
                <div class="row-fields">
                  <div class="field">
                    <label>${e.repeatMode === b ? "Start date" : "Date"}</label>
                    <input
                      type="date"
                      .value=${e.dateStart}
                      @change=${(t) => this._patchDraft({ dateStart: t.target.value })}
                    />
                  </div>
                  ${e.repeatMode === b ? l`
                        <div class="field">
                          <label>End date</label>
                          <input
                            type="date"
                            .value=${e.dateEnd}
                            @change=${(t) => this._patchDraft({ dateEnd: t.target.value })}
                          />
                        </div>
                      ` : c}
                </div>
              ` : c}

          <div class="field switch">
            <div>
              <label>Auto-pause when target reached</label>
              <div class="help">${this._autoPauseHelp(e.repeatMode)}</div>
            </div>
            <input
              type="checkbox"
              .checked=${e.autoPause}
              @change=${(t) => this._patchDraft({ autoPause: t.target.checked })}
            />
          </div>

          <div class="dialog-actions">
            <button class="ghost" @click=${() => this._closeEditor()}>Cancel</button>
            ${this._draftWasOccupied ? l`<button class="danger" ?disabled=${this._busy} @click=${() => this._manage(e.slot, 0)}>
                  Delete
                </button>` : c}
            <button class="primary" ?disabled=${this._busy} @click=${() => this._save()}>Save</button>
          </div>
        </div>
      </div>
    ` : c;
  }
  render() {
    if (!this._config) return l``;
    const e = this._hass?.states[this._config.entity], t = this._occupied;
    return l`
      <ha-card>
        <div class="header">
          <div class="title">Inverter Schedules</div>
          <div class="updated">${e ? `Updated ${e.state}` : ""}</div>
        </div>
        ${this._error && !this._draft ? l`<div class="error">${this._error}</div>` : c}
        ${e ? t.length === 0 ? l`<div class="empty-state">No schedule slots yet.</div>` : l`<div class="rows">${t.map((r) => this._renderRow(r))}</div>` : l`<div class="empty-state">Sensor ${this._config.entity} is not available.</div>`}
        <div class="add">
          <button class="link" ?disabled=${this._busy} @click=${() => this._addSlot()}>Add slot</button>
        </div>
        <div class="footer">
          <span class="hint">Lower slot numbers have higher priority if windows overlap.</span>
          ${this._confirmDeleteAll ? l`
                <span>
                  <button class="ghost" @click=${() => this._confirmDeleteAll = !1}>Cancel</button>
                  <button class="danger" ?disabled=${this._busy} @click=${() => this._deleteAll()}>
                    Confirm delete all
                  </button>
                </span>
              ` : l`<button class="danger" @click=${() => this._confirmDeleteAll = !0}>Delete all</button>`}
        </div>
      </ha-card>
      ${this._renderEditor()}
    `;
  }
};
f.styles = ue;
g([
  _()
], f.prototype, "_hass", 2);
g([
  _()
], f.prototype, "_config", 2);
g([
  _()
], f.prototype, "_draft", 2);
g([
  _()
], f.prototype, "_draftWasOccupied", 2);
g([
  _()
], f.prototype, "_openedFingerprint", 2);
g([
  _()
], f.prototype, "_stale", 2);
g([
  _()
], f.prototype, "_busy", 2);
g([
  _()
], f.prototype, "_error", 2);
g([
  _()
], f.prototype, "_confirmDeleteAll", 2);
g([
  _()
], f.prototype, "_menuSlot", 2);
g([
  _()
], f.prototype, "_slotPickerOpen", 2);
f = g([
  St("solis-schedule-card")
], f);
var me = Object.defineProperty, $e = Object.getOwnPropertyDescriptor, rt = (e, t, r, s) => {
  for (var i = s > 1 ? void 0 : s ? $e(t, r) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (i = (s ? n(t, r, i) : n(i)) || i);
  return s && i && me(t, r, i), i;
};
let I = class extends M {
  set hass(e) {
    this._hass = e;
  }
  setConfig(e) {
    this._config = { ...e };
  }
  _update(e) {
    this._config = { ...this._config, ...e }, this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
  }
  render() {
    return this._config ? l`
      <div class="form">
        <label>
          Schedule sensor
          <input
            type="text"
            .value=${this._config.entity}
            @change=${(e) => this._update({ entity: e.target.value })}
          />
        </label>
        <label>
          ESPHome action prefix
          <input
            type="text"
            .value=${this._config.device_prefix}
            @change=${(e) => this._update({ device_prefix: e.target.value })}
          />
        </label>
        <label>
          <span>
            <input
              type="checkbox"
              .checked=${!!this._config.show_empty}
              @change=${(e) => this._update({ show_empty: e.target.checked })}
            />
            Show empty slots
          </span>
        </label>
      </div>
    ` : l``;
  }
};
I.styles = fe;
rt([
  _()
], I.prototype, "_config", 2);
rt([
  _()
], I.prototype, "_hass", 2);
I = rt([
  St("solis-schedule-card-editor")
], I);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "solis-schedule-card",
  name: "Solis Schedule",
  description: "List and edit Solis inverter schedule slots",
  preview: !0
});
export {
  f as SolisScheduleCard
};
