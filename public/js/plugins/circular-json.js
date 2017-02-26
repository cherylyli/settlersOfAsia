/*! (C) WebReflection Mit Style License */
var CircularJSON = function (e, t) {
    function l(e, t, o) {
        var u = [], f = [e], l = [e], c = [o ? n : "[Circular]"], h = e, p = 1, d;
        return function (e, v) {
            return t && (v = t.call(this, e, v)), e !== "" && (h !== this && (d = p - a.call(f, this) - 1, p -= d, f.splice(p, f.length), u.splice(p - 1, u.length), h = this), typeof v == "object" && v ? (a.call(f, v) < 0 && f.push(h = v), p = f.length, d = a.call(l, v), d < 0 ? (d = l.push(v) - 1, o ? (u.push(("" + e).replace(s, r)), c[d] = n + u.join(n)) : c[d] = c[0]) : v = c[d]) : typeof v == "string" && o && (v = v.replace(r, i).replace(n, r))), v
        }
    }

    function c(e, t) {
        for (var r = 0, i = t.length; r < i; e = e[t[r++].replace(o, n)]);
        return e
    }

    function h(e) {
        return function (t, s) {
            var o = typeof s == "string";
            return o && s.charAt(0) === n ? new f(s.slice(1)) : (t === "" && (s = v(s, s, {})), o && (s = s.replace(u, "$1" + n).replace(i, r)), e ? e.call(this, t, s) : s)
        }
    }

    function p(e, t, n) {
        for (var r = 0, i = t.length; r < i; r++)t[r] = v(e, t[r], n);
        return t
    }

    function d(e, t, n) {
        for (var r in t)t.hasOwnProperty(r) && (t[r] = v(e, t[r], n));
        return t
    }

    function v(e, t, r) {
        return t instanceof Array ? p(e, t, r) : t instanceof f ? t.length ? r.hasOwnProperty(t) ? r[t] : r[t] = c(e, t.split(n)) : e : t instanceof Object ? d(e, t, r) : t
    }

    function m(t, n, r, i) {
        return e.stringify(t, l(t, n, !i), r)
    }

    function g(t, n) {
        return e.parse(t, h(n))
    }

    var n = "~", r = "\\x" + ("0" + n.charCodeAt(0).toString(16)).slice(-2), i = "\\" + r, s = new t(r, "g"), o = new t(i, "g"), u = new t("(?:^|([^\\\\]))" + i), a = [].indexOf || function (e) {
            for (var t = this.length; t-- && this[t] !== e;);
            return t
        }, f = String;
    return {stringify: m, parse: g}
}(JSON, RegExp);