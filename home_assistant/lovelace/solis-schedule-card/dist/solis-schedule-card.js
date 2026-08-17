/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const I = globalThis, X = I.ShadowRoot && (I.ShadyCSS === void 0 || I.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Q = Symbol(), it = /* @__PURE__ */ new WeakMap();
let $t = class {
  constructor(t, e, r) {
    if (this._$cssResult$ = !0, r !== Q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (X && t === void 0) {
      const r = e !== void 0 && e.length === 1;
      r && (t = it.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && it.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const kt = (s) => new $t(typeof s == "string" ? s : s + "", void 0, Q), yt = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((r, i, o) => r + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + s[o + 1], s[0]);
  return new $t(e, s, Q);
}, Pt = (s, t) => {
  if (X) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const r = document.createElement("style"), i = I.litNonce;
    i !== void 0 && r.setAttribute("nonce", i), r.textContent = e.cssText, s.appendChild(r);
  }
}, ot = X ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const r of t.cssRules) e += r.cssText;
  return kt(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Mt, defineProperty: Dt, getOwnPropertyDescriptor: Ct, getOwnPropertyNames: Ot, getOwnPropertySymbols: Tt, getPrototypeOf: Nt } = Object, v = globalThis, nt = v.trustedTypes, Ut = nt ? nt.emptyScript : "", Rt = v.reactiveElementPolyfillSupport, T = (s, t) => s, q = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? Ut : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, tt = (s, t) => !Mt(s, t), at = { attribute: !0, type: String, converter: q, reflect: !1, useDefault: !1, hasChanged: tt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), v.litPropertyMetadata ?? (v.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let w = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = at) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const r = Symbol(), i = this.getPropertyDescriptor(t, r, e);
      i !== void 0 && Dt(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, r) {
    const { get: i, set: o } = Ct(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: i, set(n) {
      const d = i?.call(this);
      o?.call(this, n), this.requestUpdate(t, d, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? at;
  }
  static _$Ei() {
    if (this.hasOwnProperty(T("elementProperties"))) return;
    const t = Nt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(T("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(T("properties"))) {
      const e = this.properties, r = [...Ot(e), ...Tt(e)];
      for (const i of r) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [r, i] of e) this.elementProperties.set(r, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, r] of this.elementProperties) {
      const i = this._$Eu(e, r);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const r = new Set(t.flat(1 / 0).reverse());
      for (const i of r) e.unshift(ot(i));
    } else t !== void 0 && e.push(ot(t));
    return e;
  }
  static _$Eu(t, e) {
    const r = e.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof t == "string" ? t.toLowerCase() : void 0;
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
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const r of e.keys()) this.hasOwnProperty(r) && (t.set(r, this[r]), delete this[r]);
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
  attributeChangedCallback(t, e, r) {
    this._$AK(t, r);
  }
  _$ET(t, e) {
    const r = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, r);
    if (i !== void 0 && r.reflect === !0) {
      const o = (r.converter?.toAttribute !== void 0 ? r.converter : q).toAttribute(e, r.type);
      this._$Em = t, o == null ? this.removeAttribute(i) : this.setAttribute(i, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const r = this.constructor, i = r._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const o = r.getPropertyOptions(i), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : q;
      this._$Em = i;
      const d = n.fromAttribute(e, o.type);
      this[i] = d ?? this._$Ej?.get(i) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, r, i = !1, o) {
    if (t !== void 0) {
      const n = this.constructor;
      if (i === !1 && (o = this[t]), r ?? (r = n.getPropertyOptions(t)), !((r.hasChanged ?? tt)(o, e) || r.useDefault && r.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, r)))) return;
      this.C(t, e, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: r, reflect: i, wrapped: o }, n) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || r || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
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
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [i, o] of r) {
        const { wrapped: n } = o, d = this[i];
        n !== !0 || this._$AL.has(i) || d === void 0 || this.C(i, void 0, o, d);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((r) => r.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
w.elementStyles = [], w.shadowRootOptions = { mode: "open" }, w[T("elementProperties")] = /* @__PURE__ */ new Map(), w[T("finalized")] = /* @__PURE__ */ new Map(), Rt?.({ ReactiveElement: w }), (v.reactiveElementVersions ?? (v.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const N = globalThis, lt = (s) => s, V = N.trustedTypes, ct = V ? V.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, vt = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, bt = "?" + y, Ht = `<${bt}>`, A = document, H = () => A.createComment(""), z = (s) => s === null || typeof s != "object" && typeof s != "function", et = Array.isArray, zt = (s) => et(s) || typeof s?.[Symbol.iterator] == "function", Z = `[ 	
\f\r]`, O = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, dt = /-->/g, ht = />/g, b = RegExp(`>|${Z}(?:([^\\s"'>=/]+)(${Z}*=${Z}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), pt = /'/g, ut = /"/g, xt = /^(?:script|style|textarea|title)$/i, Lt = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), l = Lt(1), D = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), ft = /* @__PURE__ */ new WeakMap(), x = A.createTreeWalker(A, 129);
function St(s, t) {
  if (!et(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ct !== void 0 ? ct.createHTML(t) : t;
}
const jt = (s, t) => {
  const e = s.length - 1, r = [];
  let i, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = O;
  for (let d = 0; d < e; d++) {
    const a = s[d];
    let p, u, h = -1, m = 0;
    for (; m < a.length && (n.lastIndex = m, u = n.exec(a), u !== null); ) m = n.lastIndex, n === O ? u[1] === "!--" ? n = dt : u[1] !== void 0 ? n = ht : u[2] !== void 0 ? (xt.test(u[2]) && (i = RegExp("</" + u[2], "g")), n = b) : u[3] !== void 0 && (n = b) : n === b ? u[0] === ">" ? (n = i ?? O, h = -1) : u[1] === void 0 ? h = -2 : (h = n.lastIndex - u[2].length, p = u[1], n = u[3] === void 0 ? b : u[3] === '"' ? ut : pt) : n === ut || n === pt ? n = b : n === dt || n === ht ? n = O : (n = b, i = void 0);
    const $ = n === b && s[d + 1].startsWith("/>") ? " " : "";
    o += n === O ? a + Ht : h >= 0 ? (r.push(p), a.slice(0, h) + vt + a.slice(h) + y + $) : a + y + (h === -2 ? d : $);
  }
  return [St(s, o + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class L {
  constructor({ strings: t, _$litType$: e }, r) {
    let i;
    this.parts = [];
    let o = 0, n = 0;
    const d = t.length - 1, a = this.parts, [p, u] = jt(t, e);
    if (this.el = L.createElement(p, r), x.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (i = x.nextNode()) !== null && a.length < d; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const h of i.getAttributeNames()) if (h.endsWith(vt)) {
          const m = u[n++], $ = i.getAttribute(h).split(y), W = /([.?@])?(.*)/.exec(m);
          a.push({ type: 1, index: o, name: W[2], strings: $, ctor: W[1] === "." ? Wt : W[1] === "?" ? It : W[1] === "@" ? qt : Y }), i.removeAttribute(h);
        } else h.startsWith(y) && (a.push({ type: 6, index: o }), i.removeAttribute(h));
        if (xt.test(i.tagName)) {
          const h = i.textContent.split(y), m = h.length - 1;
          if (m > 0) {
            i.textContent = V ? V.emptyScript : "";
            for (let $ = 0; $ < m; $++) i.append(h[$], H()), x.nextNode(), a.push({ type: 2, index: ++o });
            i.append(h[m], H());
          }
        }
      } else if (i.nodeType === 8) if (i.data === bt) a.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = i.data.indexOf(y, h + 1)) !== -1; ) a.push({ type: 7, index: o }), h += y.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const r = A.createElement("template");
    return r.innerHTML = t, r;
  }
}
function C(s, t, e = s, r) {
  if (t === D) return t;
  let i = r !== void 0 ? e._$Co?.[r] : e._$Cl;
  const o = z(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== o && (i?._$AO?.(!1), o === void 0 ? i = void 0 : (i = new o(s), i._$AT(s, e, r)), r !== void 0 ? (e._$Co ?? (e._$Co = []))[r] = i : e._$Cl = i), i !== void 0 && (t = C(s, i._$AS(s, t.values), i, r)), t;
}
class Bt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: r } = this._$AD, i = (t?.creationScope ?? A).importNode(e, !0);
    x.currentNode = i;
    let o = x.nextNode(), n = 0, d = 0, a = r[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let p;
        a.type === 2 ? p = new B(o, o.nextSibling, this, t) : a.type === 1 ? p = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (p = new Vt(o, this, t)), this._$AV.push(p), a = r[++d];
      }
      n !== a?.index && (o = x.nextNode(), n++);
    }
    return x.currentNode = A, i;
  }
  p(t) {
    let e = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, e), e += r.strings.length - 2) : r._$AI(t[e])), e++;
  }
}
class B {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, r, i) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = r, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = C(this, t, e), z(t) ? t === c || t == null || t === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : t !== this._$AH && t !== D && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : zt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== c && z(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: r } = t, i = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = L.createElement(St(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === i) this._$AH.p(e);
    else {
      const o = new Bt(i, this), n = o.u(this.options);
      o.p(e), this.T(n), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = ft.get(t.strings);
    return e === void 0 && ft.set(t.strings, e = new L(t)), e;
  }
  k(t) {
    et(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let r, i = 0;
    for (const o of t) i === e.length ? e.push(r = new B(this.O(H()), this.O(H()), this, this.options)) : r = e[i], r._$AI(o), i++;
    i < e.length && (this._$AR(r && r._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const r = lt(t).nextSibling;
      lt(t).remove(), t = r;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class Y {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, r, i, o) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = o, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = c;
  }
  _$AI(t, e = this, r, i) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = C(this, t, e, 0), n = !z(t) || t !== this._$AH && t !== D, n && (this._$AH = t);
    else {
      const d = t;
      let a, p;
      for (t = o[0], a = 0; a < o.length - 1; a++) p = C(this, d[r + a], e, a), p === D && (p = this._$AH[a]), n || (n = !z(p) || p !== this._$AH[a]), p === c ? t = c : t !== c && (t += (p ?? "") + o[a + 1]), this._$AH[a] = p;
    }
    n && !i && this.j(t);
  }
  j(t) {
    t === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Wt extends Y {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === c ? void 0 : t;
  }
}
class It extends Y {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== c);
  }
}
class qt extends Y {
  constructor(t, e, r, i, o) {
    super(t, e, r, i, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = C(this, t, e, 0) ?? c) === D) return;
    const r = this._$AH, i = t === c && r !== c || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, o = t !== c && (r === c || i);
    i && this.element.removeEventListener(this.name, this, r), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Vt {
  constructor(t, e, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    C(this, t);
  }
}
const Ft = N.litHtmlPolyfillSupport;
Ft?.(L, B), (N.litHtmlVersions ?? (N.litHtmlVersions = [])).push("3.3.3");
const Yt = (s, t, e) => {
  const r = e?.renderBefore ?? t;
  let i = r._$litPart$;
  if (i === void 0) {
    const o = e?.renderBefore ?? null;
    r._$litPart$ = i = new B(t.insertBefore(H(), o), o, void 0, e ?? {});
  }
  return i._$AI(s), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = globalThis;
class E extends w {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Yt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return D;
  }
}
E._$litElement$ = !0, E.finalized = !0, U.litElementHydrateSupport?.({ LitElement: E });
const Jt = U.litElementPolyfillSupport;
Jt?.({ LitElement: E });
(U.litElementVersions ?? (U.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Zt = { attribute: !0, type: String, converter: q, reflect: !1, hasChanged: tt }, Gt = (s = Zt, t, e) => {
  const { kind: r, metadata: i } = e;
  let o = globalThis.litPropertyMetadata.get(i);
  if (o === void 0 && globalThis.litPropertyMetadata.set(i, o = /* @__PURE__ */ new Map()), r === "setter" && ((s = Object.create(s)).wrapped = !0), o.set(e.name, s), r === "accessor") {
    const { name: n } = e;
    return { set(d) {
      const a = t.get.call(this);
      t.set.call(this, d), this.requestUpdate(n, a, s, !0, d);
    }, init(d) {
      return d !== void 0 && this.C(n, void 0, s, d), d;
    } };
  }
  if (r === "setter") {
    const { name: n } = e;
    return function(d) {
      const a = this[n];
      t.call(this, d), this.requestUpdate(n, a, s, !0, d);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function Kt(s) {
  return (t, e) => typeof e == "object" ? Gt(s, t, e) : ((r, i, o) => {
    const n = i.hasOwnProperty(o);
    return i.constructor.createProperty(o, r), n ? Object.getOwnPropertyDescriptor(i, o) : void 0;
  })(s, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function _(s) {
  return Kt({ ...s, state: !0, attribute: !1 });
}
const J = 0, k = 1, P = 2, S = 3, Xt = 12, _t = 6e3, Qt = ["M", "T", "W", "T", "F", "S", "S"], te = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], ee = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"], re = ["daily", "selected_days", "once", "date_range"];
function se(s, t) {
  const e = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return s === 2 && (t % 4 === 0 && t % 100 !== 0 || t % 400 === 0) ? 29 : e[s] ?? 0;
}
function At(s) {
  if (s <= 0) return !1;
  const t = Math.floor(s / 1e4), e = Math.floor(s / 100) % 100, r = s % 100;
  return t < 2020 || t > 2100 || e < 1 || e > 12 || r < 1 ? !1 : r <= se(e, t);
}
function R(s) {
  if (!At(s)) return "";
  const t = Math.floor(s / 1e4), e = Math.floor(s / 100) % 100, r = s % 100;
  return `${t}-${String(e).padStart(2, "0")}-${String(r).padStart(2, "0")}`;
}
function G(s) {
  const t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!t) return 0;
  const e = Number(t[1]) * 1e4 + Number(t[2]) * 100 + Number(t[3]);
  return At(e) ? e : 0;
}
function ie(s) {
  const t = [];
  for (let e = 0; e < 7; e++)
    s & 1 << e && t.push(e);
  return t;
}
function oe(s) {
  return s.reduce((t, e) => e >= 0 && e <= 6 ? t | 1 << e : t, 0);
}
function ne(s) {
  return Qt.map((t, e) => (s & 1 << e) !== 0 ? t : "·").join("");
}
function F(s) {
  const t = /^(\d{1,2}):(\d{2})$/.exec((s || "").trim());
  if (!t) return null;
  const e = Number(t[1]), r = Number(t[2]);
  return e < 0 || e > 23 || r < 0 || r > 59 ? null : { hour: e, minute: r };
}
function gt(s, t) {
  const e = F(s), r = F(t);
  return !e || !r ? !1 : e.hour * 60 + e.minute > r.hour * 60 + r.minute;
}
function ae(s) {
  return s > 0 ? `${s} W` : "Unlimited";
}
function M(s) {
  return s ? s.Mode === "Idle" || s.Mode === "" || !s.Mode : !0;
}
function le(s) {
  return M(s) ? "empty" : s["Paused By Target"] ? "auto-paused" : s.Active ? "active" : "paused";
}
function ce(s) {
  switch (s) {
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
function de(s) {
  const t = s["Repeat Mode"] ?? 0;
  if (t === k) return ne(s["Selected Days"] ?? 0);
  if (t === P) return R(s["Date Start"] ?? 0) || String(s["Date Start"] ?? "");
  if (t === S) {
    const e = R(s["Date Start"] ?? 0) || String(s["Date Start"] ?? ""), r = R(s["Date End"] ?? 0) || String(s["Date End"] ?? "");
    return `${e}–${r}`;
  }
  return "Daily";
}
function mt(s) {
  return JSON.stringify(s);
}
function he(s) {
  const t = M(s);
  return {
    slot: s.Slot,
    operationMode: s.Mode === "Discharge" ? 2 : 1,
    start: t ? "00:00" : s["Start Time"] || "00:00",
    end: t ? "00:00" : s["End Time"] || "00:00",
    targetSoc: t ? 100 : Number(s["Target SOC"] ?? 100),
    power: t ? 0 : Number(s.Power ?? 0),
    repeatMode: t ? J : s["Repeat Mode"] ?? 0,
    selectedDays: ie(s["Selected Days"] ?? 0),
    dateStart: R(s["Date Start"] ?? 0),
    dateEnd: R(s["Date End"] ?? 0),
    autoPause: !!s["Auto Pause"]
  };
}
function pe(s) {
  return {
    slot: s,
    operationMode: 1,
    start: "00:00",
    end: "00:00",
    targetSoc: 100,
    power: 0,
    repeatMode: J,
    selectedDays: [],
    dateStart: "",
    dateEnd: "",
    autoPause: !1
  };
}
function ue(s) {
  if (s.slot < 1 || s.slot > 12) return "Slot must be 1-12.";
  if (s.operationMode !== 1 && s.operationMode !== 2) return "Choose Charge or Discharge.";
  if (!F(s.start)) return "Start time must be HH:MM.";
  if (!F(s.end)) return "End time must be HH:MM.";
  if (s.targetSoc < 0 || s.targetSoc > 100) return "Target SOC must be 0-100.";
  if (s.power < 0 || s.power > _t) return `Power must be 0-${_t}.`;
  if (![J, k, P, S].includes(s.repeatMode))
    return "Invalid repeat mode.";
  if (s.repeatMode === k) {
    const t = oe(s.selectedDays);
    if (t < 1 || t > 127) return "Select at least one day.";
  }
  if (s.repeatMode === P && !G(s.dateStart))
    return "Once requires a valid start date.";
  if (s.repeatMode === S) {
    const t = G(s.dateStart), e = G(s.dateEnd);
    if (!t || !e) return "Date range requires a start and end date.";
    if (t > e) return "Date range start must be on or before the end date.";
  }
  return null;
}
function fe(s, t) {
  return {
    entity_id: s,
    slot: t.slot,
    mode: t.operationMode === 1 ? "charge" : "discharge",
    start: t.start,
    end: t.end,
    target_soc: t.targetSoc,
    power: t.power,
    repeat: re[t.repeatMode],
    days: t.selectedDays.map((e) => ee[e]),
    date_start: t.dateStart || void 0,
    date_end: t.dateEnd || void 0,
    auto_pause: t.autoPause
  };
}
function K(s) {
  return new Set(s.filter((t) => !M(t)).map((t) => t.Slot));
}
function _e(s) {
  const t = K(s);
  for (let e = 1; e <= 12; e++)
    if (!t.has(e)) return e;
  return null;
}
function ge(s) {
  return Array.isArray(s) ? s.map((t, e) => {
    const r = t;
    return {
      Slot: Number(r.Slot ?? e + 1),
      Active: !!r.Active,
      Mode: String(r.Mode ?? "Idle"),
      "Start Time": String(r["Start Time"] ?? "00:00"),
      "End Time": String(r["End Time"] ?? "00:00"),
      "Target SOC": Number(r["Target SOC"] ?? 0),
      Power: Number(r.Power ?? 0),
      Repeat: !!r.Repeat,
      "Repeat Mode": Number(r["Repeat Mode"] ?? 0),
      "Selected Days": Number(r["Selected Days"] ?? 0),
      "Date Start": Number(r["Date Start"] ?? 0),
      "Date End": Number(r["Date End"] ?? 0),
      "Auto Pause": !!r["Auto Pause"],
      "Paused By Target": !!r["Paused By Target"]
    };
  }) : [];
}
const me = yt`
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
`, $e = yt`
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
var ye = Object.defineProperty, g = (s, t, e, r) => {
  for (var i = void 0, o = s.length - 1, n; o >= 0; o--)
    (n = s[o]) && (i = n(t, e, i) || i);
  return i && ye(t, e, i), i;
};
const rt = class rt extends E {
  constructor() {
    super(...arguments), this._draft = null, this._draftWasOccupied = !1, this._openedFingerprint = "", this._stale = !1, this._busy = !1, this._error = "", this._confirmDeleteAll = !1, this._menuSlot = null, this._slotPickerOpen = !1;
  }
  static getStubConfig() {
    return {
      entity: "sensor.solis_eh1_schedule"
    };
  }
  static getConfigElement() {
    return document.createElement("solis-schedule-card-editor");
  }
  setConfig(t) {
    if (!t?.entity) throw new Error("entity is required");
    this._config = t;
  }
  set hass(t) {
    if (this._hass = t, this._draft) {
      const e = this._slotByNumber(this._draft.slot), r = e ? mt(e) : "";
      this._stale = r !== this._openedFingerprint;
    }
  }
  getCardSize() {
    return 6;
  }
  get _slots() {
    const t = this._hass?.states[this._config?.entity ?? ""];
    return ge(t?.attributes.data);
  }
  get _occupied() {
    const t = this._slots;
    return this._config?.show_empty ? t : t.filter((e) => !M(e));
  }
  _slotByNumber(t) {
    return this._slots.find((e) => e.Slot === t);
  }
  async _call(t, e) {
    if (this._hass) {
      this._busy = !0, this._error = "";
      try {
        await this._hass.callService("solis_eh1", t, e);
      } catch (r) {
        this._error = r instanceof Error ? r.message : "Home Assistant action failed.";
      } finally {
        this._busy = !1;
      }
    }
  }
  _openEditor(t) {
    const e = this._slotByNumber(t);
    this._draftWasOccupied = !!(e && !M(e)), this._draft = e && !M(e) ? he(e) : pe(t), this._openedFingerprint = e ? mt(e) : "", this._stale = !1, this._error = "", this._menuSlot = null, this._slotPickerOpen = !1;
  }
  _closeEditor() {
    this._draft = null, this._stale = !1, this._error = "", this._slotPickerOpen = !1;
  }
  _reloadDraft() {
    this._draft && this._openEditor(this._draft.slot);
  }
  _addSlot() {
    const t = _e(this._slots);
    if (t == null) {
      this._error = "All 12 slots are in use.";
      return;
    }
    this._openEditor(t);
  }
  async _save() {
    if (!this._draft) return;
    const t = ue(this._draft);
    if (t) {
      this._error = t;
      return;
    }
    await this._call("upsert_schedule", fe(this._config.entity, this._draft)), this._error || this._closeEditor();
  }
  async _manage(t, e) {
    this._menuSlot = null;
    const r = e === 0 ? "delete" : e === 1 ? "pause" : "resume";
    await this._call("manage_slot", {
      entity_id: this._config.entity,
      slot: t,
      action: r
    }), e === 0 && this._draft?.slot === t && this._closeEditor();
  }
  async _deleteAll() {
    await this._call("delete_all_schedules", { entity_id: this._config.entity }), this._confirmDeleteAll = !1, this._closeEditor();
  }
  _patchDraft(t) {
    this._draft && (this._draft = { ...this._draft, ...t });
  }
  _toggleDay(t) {
    if (!this._draft) return;
    const e = new Set(this._draft.selectedDays);
    e.has(t) ? e.delete(t) : e.add(t), this._patchDraft({ selectedDays: [...e].sort((r, i) => r - i) });
  }
  _autoPauseHelp(t) {
    return t === P ? "Once slots are deleted after the time window ends." : "Slot resumes after the time window ends.";
  }
  _renderWhen(t) {
    const e = de(t);
    return (t["Repeat Mode"] ?? 0) === k ? l`<span class="days" title="Selected days">${e}</span>` : l`<span>${e}</span>`;
  }
  _renderRow(t) {
    const e = le(t), r = gt(t["Start Time"], t["End Time"]);
    return l`
      <div
        class="row"
        role="button"
        tabindex="0"
        @click=${() => this._openEditor(t.Slot)}
        @keydown=${(i) => {
      (i.key === "Enter" || i.key === " ") && (i.preventDefault(), this._openEditor(t.Slot));
    }}
      >
        <div class="badge">${t.Slot}</div>
        <div class="body">
          <div class="line1">
            <span class="chip ${e}">${ce(e)}</span>
            <span class="mode ${t.Mode.toLowerCase()}">${t.Mode}</span>
            <span class="window">${t["Start Time"]} – ${t["End Time"]}</span>
            ${r ? l`<span class="overnight">Overnight</span>` : c}
          </div>
          <div class="line2">
            ${this._renderWhen(t)}
            <span>SOC ${t["Target SOC"]}%</span>
            <span>${ae(t.Power)}</span>
            ${t["Auto Pause"] ? l`<span>Auto-pause</span>` : c}
          </div>
        </div>
        <div class="actions" @click=${(i) => i.stopPropagation()}>
          ${e === "active" ? l`<button class="icon" title="Pause" @click=${() => this._manage(t.Slot, 1)}>Pause</button>` : l`<button class="icon" title="Resume" @click=${() => this._manage(t.Slot, 2)}>Go</button>`}
          <button
            class="icon"
            title="More"
            @click=${() => this._menuSlot = this._menuSlot === t.Slot ? null : t.Slot}
          >
            More
          </button>
        </div>
      </div>
      ${this._menuSlot === t.Slot ? l`
            <div class="actions" style="justify-content: flex-end">
              <button class="ghost" @click=${() => this._openEditor(t.Slot)}>Edit</button>
              <button class="ghost" @click=${() => this._manage(t.Slot, e === "active" ? 1 : 2)}>
                ${e === "active" ? "Pause" : "Resume"}
              </button>
              <button class="danger" @click=${() => this._manage(t.Slot, 0)}>Delete</button>
            </div>
          ` : c}
    `;
  }
  _chooseSlot(t) {
    K(this._slots).has(t) || (this._patchDraft({ slot: t }), this._slotPickerOpen = !1);
  }
  _renderSlotPicker(t) {
    if (this._draftWasOccupied) return c;
    const e = K(this._slots);
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
          ${t.slot}
        </button>
        ${this._slotPickerOpen ? l`
              <div class="slot-popover" role="listbox" aria-label="Choose slot" @click=${(r) => r.stopPropagation()}>
                ${Array.from({ length: Xt }, (r, i) => i + 1).map((r) => {
      const i = e.has(r), o = r === t.slot;
      return l`
                    <button
                      type="button"
                      role="option"
                      class="slot-cell ${o ? "selected" : ""} ${i ? "in-use" : ""}"
                      aria-selected=${o}
                      ?disabled=${i}
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
    const t = this._draft;
    return t ? l`
      <div class="overlay" @click=${() => this._closeEditor()}>
        <div
          class="dialog"
          @click=${(e) => {
      e.stopPropagation(), this._slotPickerOpen = !1;
    }}
        >
          <h2 class="dialog-title">
            ${this._draftWasOccupied ? `Edit slot ${t.slot}` : l`Add slot ${this._renderSlotPicker(t)}`}
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
                aria-pressed=${t.operationMode === 1}
                @click=${() => this._patchDraft({ operationMode: 1 })}
              >
                Charge
              </button>
              <button
                aria-pressed=${t.operationMode === 2}
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
                .value=${t.start}
                @change=${(e) => this._patchDraft({ start: e.target.value })}
              />
            </div>
            <div class="field">
              <label>End</label>
              <input
                type="time"
                .value=${t.end}
                @change=${(e) => this._patchDraft({ end: e.target.value })}
              />
            </div>
          </div>
          ${gt(t.start, t.end) ? l`<div class="help" style="margin-top:-8px;margin-bottom:12px">Overnight window: stays on the start day after midnight.</div>` : c}

          <div class="row-fields">
            <div class="field">
              <label>Target SOC (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                .value=${String(t.targetSoc)}
                @change=${(e) => this._patchDraft({ targetSoc: Number(e.target.value) })}
              />
            </div>
            <div class="field">
              <label>Power (W)</label>
              <input
                type="number"
                min="0"
                max="6000"
                .value=${String(t.power)}
                @change=${(e) => this._patchDraft({ power: Number(e.target.value) })}
              />
              <span class="help">0 = unlimited</span>
            </div>
          </div>

          <div class="field">
            <label>Repeat</label>
            <div class="segmented">
              ${[
      [J, "Daily"],
      [k, "Selected days"],
      [P, "Once"],
      [S, "Date range"]
    ].map(
      ([e, r]) => l`
                  <button
                    aria-pressed=${t.repeatMode === e}
                    @click=${() => this._patchDraft({ repeatMode: e })}
                  >
                    ${r}
                  </button>
                `
    )}
            </div>
          </div>

          ${t.repeatMode === k ? l`
                <div class="field">
                  <label>Days</label>
                  <div class="segmented" role="group" aria-label="Days">
                    ${te.map(
      (e, r) => l`
                        <button
                          aria-pressed=${t.selectedDays.includes(r)}
                          @click=${() => this._toggleDay(r)}
                        >
                          ${e}
                        </button>
                      `
    )}
                  </div>
                </div>
              ` : c}

          ${t.repeatMode === P || t.repeatMode === S ? l`
                <div class="row-fields">
                  <div class="field">
                    <label>${t.repeatMode === S ? "Start date" : "Date"}</label>
                    <input
                      type="date"
                      .value=${t.dateStart}
                      @change=${(e) => this._patchDraft({ dateStart: e.target.value })}
                    />
                  </div>
                  ${t.repeatMode === S ? l`
                        <div class="field">
                          <label>End date</label>
                          <input
                            type="date"
                            .value=${t.dateEnd}
                            @change=${(e) => this._patchDraft({ dateEnd: e.target.value })}
                          />
                        </div>
                      ` : c}
                </div>
              ` : c}

          <div class="field switch">
            <div>
              <label>Auto-pause when target reached</label>
              <div class="help">${this._autoPauseHelp(t.repeatMode)}</div>
            </div>
            <input
              type="checkbox"
              .checked=${t.autoPause}
              @change=${(e) => this._patchDraft({ autoPause: e.target.checked })}
            />
          </div>

          <div class="dialog-actions">
            <button class="ghost" @click=${() => this._closeEditor()}>Cancel</button>
            ${this._draftWasOccupied ? l`<button class="danger" ?disabled=${this._busy} @click=${() => this._manage(t.slot, 0)}>
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
    const t = this._hass?.states[this._config.entity], e = this._occupied;
    return l`
      <ha-card>
        <div class="header">
          <div class="title">Inverter Schedules</div>
          <div class="updated">${t ? `Updated ${t.state}` : ""}</div>
        </div>
        ${this._error && !this._draft ? l`<div class="error">${this._error}</div>` : c}
        ${t ? e.length === 0 ? l`<div class="empty-state">No schedule slots yet.</div>` : l`<div class="rows">${e.map((r) => this._renderRow(r))}</div>` : l`<div class="empty-state">Sensor ${this._config.entity} is not available.</div>`}
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
rt.styles = me;
let f = rt;
g([
  _()
], f.prototype, "_hass");
g([
  _()
], f.prototype, "_config");
g([
  _()
], f.prototype, "_draft");
g([
  _()
], f.prototype, "_draftWasOccupied");
g([
  _()
], f.prototype, "_openedFingerprint");
g([
  _()
], f.prototype, "_stale");
g([
  _()
], f.prototype, "_busy");
g([
  _()
], f.prototype, "_error");
g([
  _()
], f.prototype, "_confirmDeleteAll");
g([
  _()
], f.prototype, "_menuSlot");
g([
  _()
], f.prototype, "_slotPickerOpen");
var ve = Object.defineProperty, wt = (s, t, e, r) => {
  for (var i = void 0, o = s.length - 1, n; o >= 0; o--)
    (n = s[o]) && (i = n(t, e, i) || i);
  return i && ve(t, e, i), i;
};
const st = class st extends E {
  set hass(t) {
    this._hass = t;
  }
  setConfig(t) {
    this._config = { ...t };
  }
  _update(t) {
    this._config = { ...this._config, ...t }, this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
  }
  render() {
    return this._config ? l`
      <div class="form">
        <label>
          Schedule sensor
          <input
            type="text"
            .value=${this._config.entity}
            @change=${(t) => this._update({ entity: t.target.value })}
          />
        </label>
        <label>
          <span>
            <input
              type="checkbox"
              .checked=${!!this._config.show_empty}
              @change=${(t) => this._update({ show_empty: t.target.checked })}
            />
            Show empty slots
          </span>
        </label>
      </div>
    ` : l``;
  }
};
st.styles = $e;
let j = st;
wt([
  _()
], j.prototype, "_config");
wt([
  _()
], j.prototype, "_hass");
function Et(s, t) {
  customElements.get(s) || customElements.define(s, t);
}
Et("solis-schedule-card", f);
Et("solis-schedule-card-editor", j);
window.customCards = window.customCards || [];
window.customCards.some((s) => s.type === "solis-schedule-card") || window.customCards.push({
  type: "solis-schedule-card",
  name: "Solis Schedule",
  description: "List and edit Solis inverter schedule slots",
  preview: !0
});
export {
  f as SolisScheduleCard
};
