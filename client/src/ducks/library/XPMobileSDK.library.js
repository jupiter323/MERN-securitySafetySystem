import $ from 'jquery'
import rootReducer from '../redux'

let XPMobileSDK = {
    library: {},
    interfaces: {},
};
let XPMobileSDKSettings = {

    fileName: 'XPMobileSDK.js',
    clientType: 'WebClient',
    communicationChanel: '/XProtectMobile/Communication',
    videoChanel: '/XProtectMobile/Video',
    audioChannel: '/XProtectMobile/Audio',
    MobileServerURL: '',
    defaultEncryptionPadding: 'Iso10126',
    primeLength: 1024,
    videoConnectionTimeout: 20000,
    resamplingFactor: 1 / 1000000,

    supportsMultiThreaded: false,
    supportsCarousels: false,
    supportsFootages: false,
    supportsCHAP: true,

    SupportsAudioIn: true,
    SupportsAudioOut: false,
    AudioCompressionLevel: 99,
    AudioCompressionLevelAudioAPI: 41,

};

function findPrimes(e) {
    var t, n, o, r;
    for (n = new Array(e), t = 0; t < e; t++) n[t] = 0;
    for (n[0] = 2, o = 0; n[o] < e;) {
        for (t = n[o] * n[o]; t < e; t += n[o]) n[t] = 1;
        for (o++, n[o] = n[o - 1] + 1; n[o] < e && n[n[o]]; n[o]++) ;
    }
    for (r = new Array(o), t = 0; t < o; t++) r[t] = n[t];
    return r
}
let mr_x1, mr_r, mr_a, mask, bpe, rpprb, primes, pows;
let recLimit, s_q, t, T;
let eg_u, eg_v, eg_A, eg_B, eg_C, eg_D;
let s_i2, s_R, s_n1, s_r2, s_d, s_x1, s_x2, s_b, s_n, s_i, s_rm, s_a, s_aa, s6;
let digitsStr, radix, buff;
let s0, s7, s3, one, sa, ss, s4, s5, s1, s2, md_q1, md_q2, md_q3, md_r, md_r1, md_r2, md_tt, c1, c2, c3;
let Settings = {};

function millerRabinInt(e, t) {
    return mr_x1.length !== e.length && (mr_x1 = dup(e), mr_r = dup(e), mr_a = dup(e)), copyInt_(mr_a, t), millerRabin(e, mr_a)
}
function millerRabin(e, t) {
    var n, o, r, i;
    for (mr_x1.length !== e.length && (mr_x1 = dup(e), mr_r = dup(e), mr_a = dup(e)), copy_(mr_a, t), copy_(mr_r, e), copy_(mr_x1, e), addInt_(mr_r, -1), addInt_(mr_x1, -1), r = 0, n = 0; n < mr_r.length; n++) for (o = 1; o < mask; o <<= 1) e[n] & o ? (i = r < mr_r.length + bpe ? r : 0, n = mr_r.length, o = mask) : r++;
    if (i && rightShift_(mr_r, i), powMod_(mr_a, mr_r, e), !equalsInt(mr_a, 1) && !equals(mr_a, mr_x1)) {
        for (o = 1; o <= i - 1 && !equals(mr_a, mr_x1);) {
            if (squareMod_(mr_a, e), equalsInt(mr_a, 1)) return 0;
            o++
        }
        if (!equals(mr_a, mr_x1)) return 0
    }
    return 1
}

function bitSize(e) {
    var t, n, o;
    for (t = e.length - 1; 0 === e[t] && t > 0; t--) ;
    for (n = 0, o = e[t]; o; o >>= 1, n++) ;
    return n += bpe * t
}

function expand(e, t) {
    var n = int2bigInt(0, (e.length > t ? e.length : t) * bpe, 0);
    return copy_(n, e), n
}

function randTruePrime(e) {
    var t = int2bigInt(0, e, 0);
    return randTruePrime_(t, e), trim(t, 1)
}

function randProbPrime(e) {
    return e >= 600 ? randProbPrimeRounds(e, 2) : e >= 550 ? randProbPrimeRounds(e, 4) : e >= 500 ? randProbPrimeRounds(e, 5) : e >= 400 ? randProbPrimeRounds(e, 6) : e >= 350 ? randProbPrimeRounds(e, 7) : e >= 300 ? randProbPrimeRounds(e, 9) : e >= 250 ? randProbPrimeRounds(e, 12) : e >= 200 ? randProbPrimeRounds(e, 15) : e >= 150 ? randProbPrimeRounds(e, 18) : e >= 100 ? randProbPrimeRounds(e, 27) : randProbPrimeRounds(e, 40)
}

function randProbPrimeRounds(e, t) {
    var n, o, r, i;
    for (i = 3e4, n = int2bigInt(0, e, 0), 0 === primes.length && (primes = findPrimes(3e4)), rpprb.length !== n.length && (rpprb = dup(n)); ;) {
        for (randBigInt_(n, e, 0), n[0] |= 1, r = 0, o = 0; o < primes.length && primes[o] <= i; o++) if (0 === modInt(n, primes[o]) && !equalsInt(n, primes[o])) {
            r = 1;
            break
        }
        for (o = 0; o < t && !r; o++) {
            for (randBigInt_(rpprb, e, 0); !greater(n, rpprb);) randBigInt_(rpprb, e, 0);
            millerRabin(n, rpprb) || (r = 1)
        }
        if (!r) return n
    }
}

function mod(e, t) {
    var n = dup(e);
    return mod_(n, t), trim(n, 1)
}

function addInt(e, t) {
    var n = expand(e, e.length + 1);
    return addInt_(n, t), trim(n, 1)
}

function mult(e, t) {
    var n = expand(e, e.length + t.length);
    return mult_(n, t), trim(n, 1)
}

function powMod(e, t, n) {
    var o = expand(e, n.length);
    return powMod_(o, trim(t, 2), trim(n, 2), 0), trim(o, 1)
}

function sub(e, t) {
    var n = expand(e, e.length > t.length ? e.length + 1 : t.length + 1);
    return sub_(n, t), trim(n, 1)
}

function add(e, t) {
    var n = expand(e, e.length > t.length ? e.length + 1 : t.length + 1);
    return add_(n, t), trim(n, 1)
}

function inverseMod(e, t) {
    var n, o = expand(e, t.length);
    return n = inverseMod_(o, t), n ? trim(o, 1) : null
}

function multMod(e, t, n) {
    var o = expand(e, n.length);
    return multMod_(o, t, n), trim(o, 1)
}

function randTruePrime_(e, t) {
    var n, o, r, i, a, s, c, l, u, d, f;
    if (0 === primes.length && (primes = findPrimes(3e4)), 0 === pows.length) for (pows = new Array(512), a = 0; a < 512; a++) pows[a] = Math.pow(2, a / 511 - 1);
    if (n = .1, o = 20, recLimit = 20, s_i2.length !== e.length && (s_i2 = dup(e), s_R = dup(e), s_n1 = dup(e), s_r2 = dup(e), s_d = dup(e), s_x1 = dup(e), s_x2 = dup(e), s_b = dup(e), s_n = dup(e), s_i = dup(e), s_rm = dup(e), s_q = dup(e), s_a = dup(e), s_aa = dup(e)), t <= recLimit) {
        for (r = (1 << (t + 2 >> 1)) - 1, copyInt_(e, 0), i = 1; i;) for (i = 0, e[0] = 1 | 1 << t - 1 | Math.floor(Math.random() * (1 << t)), a = 1; a < primes.length && (primes[a] & r) === primes[a]; a++) if (0 === e[0] % primes[a]) {
            i = 1;
            break
        }
        return void carry_(e)
    }
    if (c = n * t * t, t > 2 * o) for (s = 1; t - t * s <= o;) s = pows[Math.floor(512 * Math.random())]; else s = .5;
    for (f = Math.floor(s * t) + 1, randTruePrime_(s_q, f), copyInt_(s_i2, 0), s_i2[Math.floor((t - 2) / bpe)] |= 1 << (t - 2) % bpe, divide_(s_i2, s_q, s_i, s_rm), u = bitSize(s_i); ;) {
        for (; randBigInt_(s_R, u, 0), !greater(s_i, s_R);) ;
        for (addInt_(s_R, 1), add_(s_R, s_i), copy_(s_n, s_q), mult_(s_n, s_R), multInt_(s_n, 2), addInt_(s_n, 1), copy_(s_r2, s_R), multInt_(s_r2, 2), l = 0, a = 0; a < primes.length && primes[a] < c; a++) if (0 === modInt(s_n, primes[a]) && !equalsInt(s_n, primes[a])) {
            l = 1;
            break
        }
        if (l || millerRabinInt(s_n, 2) || (l = 1), !l) {
            for (addInt_(s_n, -3), a = s_n.length - 1; 0 === s_n[a] && a > 0; a--) ;
            var w;
            for (d = 0, w = s_n[a]; w; w >>= 1, d++) ;
            for (d += bpe * a; randBigInt_(s_a, d, 0), !greater(s_n, s_a);) ;
            if (addInt_(s_n, 3), addInt_(s_a, 2), copy_(s_b, s_a), copy_(s_n1, s_n), addInt_(s_n1, -1), powMod_(s_b, s_n1, s_n), addInt_(s_b, -1), isZero(s_b) && (copy_(s_b, s_a), powMod_(s_b, s_r2, s_n), addInt_(s_b, -1), copy_(s_aa, s_n), copy_(s_d, s_b), GCD_(s_d, s_n), equalsInt(s_d, 1))) return void copy_(e, s_aa)
        }
    }
}

function randBigInt(e, t) {
    var n, o;
    return n = Math.floor((e - 1) / bpe) + 2, o = int2bigInt(0, 0, n), randBigInt_(o, e, t), o
}

function randBigInt_(e, t, n) {
    var o, r;
    for (o = 0; o < e.length; o++) e[o] = 0;
    for (r = Math.floor((t - 1) / bpe) + 1, o = 0; o < r; o++) e[o] = Math.floor(Math.random() * (1 << bpe - 1));
    e[r - 1] &= (2 << (t - 1) % bpe) - 1, 1 === n && (e[r - 1] |= 1 << (t - 1) % bpe)
}

function GCD(e, t) {
    var n, o;
    return n = dup(e), o = dup(t), GCD_(n, o), n
}

function GCD_(e, n) {
    var o, r, i, a, s, c, l, u, d;
    for (T.length !== e.length && (T = dup(e)), d = 1; d;) {
        for (d = 0, o = 1; o < n.length; o++) if (n[o]) {
            d = 1;
            break
        }
        if (!d) break;
        for (o = e.length; !e[o] && o >= 0; o--) ;
        let qp;
        for (r = e[o], i = n[o], a = 1, s = 0, c = 0, l = 1; i + c && i + l && (u = Math.floor((r + a) / (i + c)), qp = Math.floor((r + s) / (i + l)), u === qp);) t = a - u * c, a = c, c = t, t = s - u * l, s = l, l = t, t = r - u * i, r = i, i = t;
        s ? (copy_(T, e), linComb_(e, n, a, s), linComb_(n, T, l, c)) : (mod_(e, n), copy_(T, e), copy_(e, n), copy_(n, T))
    }
    if (0 !== n[0]) for (t = modInt(e, n[0]), copyInt_(e, n[0]), n[0] = t; n[0];) e[0] %= n[0], t = e[0], e[0] = n[0], n[0] = t
}

function inverseMod_(e, t) {
    var n = 1 + 2 * Math.max(e.length, t.length);
    if (!(1 & e[0] || 1 & t[0])) return copyInt_(e, 0), 0;
    for (eg_u.length !== n && (eg_u = new Array(n), eg_v = new Array(n), eg_A = new Array(n), eg_B = new Array(n), eg_C = new Array(n), eg_D = new Array(n)), copy_(eg_u, e), copy_(eg_v, t), copyInt_(eg_A, 1), copyInt_(eg_B, 0), copyInt_(eg_C, 0), copyInt_(eg_D, 1); ;) {
        for (; !(1 & eg_u[0]);) halve_(eg_u), 1 & eg_A[0] || 1 & eg_B[0] ? (add_(eg_A, t), halve_(eg_A), sub_(eg_B, e), halve_(eg_B)) : (halve_(eg_A), halve_(eg_B));
        for (; !(1 & eg_v[0]);) halve_(eg_v), 1 & eg_C[0] || 1 & eg_D[0] ? (add_(eg_C, t), halve_(eg_C), sub_(eg_D, e), halve_(eg_D)) : (halve_(eg_C), halve_(eg_D));
        if (greater(eg_v, eg_u) ? (sub_(eg_v, eg_u), sub_(eg_C, eg_A), sub_(eg_D, eg_B)) : (sub_(eg_u, eg_v), sub_(eg_A, eg_C), sub_(eg_B, eg_D)), equalsInt(eg_u, 0)) return negative(eg_C) && add_(eg_C, t), copy_(e, eg_C), equalsInt(eg_v, 1) ? 1 : (copyInt_(e, 0), 0)
    }
}

function inverseModInt(e, t) {
    for (var n = 1, o = 0; ;) {
        if (1 === e) return n;
        if (0 === e) return 0;
        if (o -= n * Math.floor(t / e), 1 === (t %= e)) return o;
        if (0 === t) return 0;
        n -= o * Math.floor(e / t), e %= t
    }
}

function inverseModInt_(e, t) {
    return inverseModInt(e, t)
}

function eGCD_(e, t, n, o, r) {
    var i = 0, a = Math.max(e.length, t.length);
    for (eg_u.length !== a && (eg_u = new Array(a), eg_A = new Array(a), eg_B = new Array(a), eg_C = new Array(a), eg_D = new Array(a)); !(1 & e[0] || 1 & t[0]);) halve_(e), halve_(t), i++;
    for (copy_(eg_u, e), copy_(n, t), copyInt_(eg_A, 1), copyInt_(eg_B, 0), copyInt_(eg_C, 0), copyInt_(eg_D, 1); ;) {
        for (; !(1 & eg_u[0]);) halve_(eg_u), 1 & eg_A[0] || 1 & eg_B[0] ? (add_(eg_A, t), halve_(eg_A), sub_(eg_B, e), halve_(eg_B)) : (halve_(eg_A), halve_(eg_B));
        for (; !(1 & n[0]);) halve_(n), 1 & eg_C[0] || 1 & eg_D[0] ? (add_(eg_C, t), halve_(eg_C), sub_(eg_D, e), halve_(eg_D)) : (halve_(eg_C), halve_(eg_D));
        if (greater(n, eg_u) ? (sub_(n, eg_u), sub_(eg_C, eg_A), sub_(eg_D, eg_B)) : (sub_(eg_u, n), sub_(eg_A, eg_C), sub_(eg_B, eg_D)), equalsInt(eg_u, 0)) return negative(eg_C) && (add_(eg_C, t), sub_(eg_D, e)), multInt_(eg_D, -1), copy_(o, eg_C), copy_(r, eg_D), void leftShift_(n, i)
    }
}

function negative(e) {
    return e[e.length - 1] >> bpe - 1 & 1
}

function greaterShift(e, t, n) {
    var o, r = e.length, i = t.length;
    var k;
    for (k = r + n < i ? r + n : i, o = i - 1 - n; o < r && o >= 0; o++) if (e[o] > 0) return 1;
    for (o = r - 1 + n; o < i; o++) if (t[o] > 0) return 0;
    for (o = k - 1; o >= n; o--) {
        if (e[o - n] > t[o]) return 1;
        if (e[o - n] < t[o]) return 0
    }
    return 0
}

function greater(e, t) {
    var n, o = e.length < t.length ? e.length : t.length;
    for (n = e.length; n < t.length; n++) if (t[n]) return 0;
    for (n = t.length; n < e.length; n++) if (e[n]) return 1;
    for (n = o - 1; n >= 0; n--) {
        if (e[n] > t[n]) return 1;
        if (e[n] < t[n]) return 0
    }
    return 0
}

function divide_(e, t, n, o) {
    var r, i, a, s, c, l, u, d;
    for (copy_(o, e), i = t.length; 0 === t[i - 1]; i--) ;
    for (d = t[i - 1], u = 0; d; u++) d >>= 1;
    for (u = bpe - u, leftShift_(t, u), leftShift_(o, u), r = o.length; 0 === o[r - 1] && r > i; r--) ;
    for (copyInt_(n, 0); !greaterShift(t, o, r - i);) subShift_(o, t, r - i), n[r - i]++;
    for (a = r - 1; a >= i; a--) {
        for (o[a] === t[i - 1] ? n[a - i] = mask : n[a - i] = Math.floor((o[a] * radix + o[a - 1]) / t[i - 1]); c = (i > 1 ? t[i - 2] : 0) * n[a - i], l = c >> bpe, c &= mask, s = l + n[a - i] * t[i - 1], l = s >> bpe, s &= mask, l === o[a] ? s === o[a - 1] ? c > (a > 1 ? o[a - 2] : 0) : s > o[a - 1] : l > o[a];) n[a - i]--;
        linCombShift_(o, t, -n[a - i], a - i), negative(o) && (addShift_(o, t, a - i), n[a - i]--)
    }
    rightShift_(t, u), rightShift_(o, u)
}

function carry_(e) {
    var t, n, o, r;
    for (n = e.length, o = 0, t = 0; t < n; t++) o += e[t], r = 0, o < 0 && (r = -(o >> bpe), o += r * radix), e[t] = o & mask, o = (o >> bpe) - r
}

function modInt(e, t) {
    var n, o = 0;
    for (n = e.length - 1; n >= 0; n--) o = (o * radix + e[n]) % t;
    return o
}

function int2bigInt(e, t, n) {
    var o;
    return o = Math.ceil(t / bpe) + 1, o = n > o ? n : o, buff = new Array(o), copyInt_(buff, e), buff
}

function str2bigInt(e, t, n) {
    var o, r, i, a, s, c = e.length;
    if (-1 === t) {
        for (i = new Array(0); ;) {
            for (a = new Array(i.length + 1), r = 0; r < i.length; r++) a[r + 1] = i[r];
            if (a[0] = parseInt(e, 10), i = a, (o = e.indexOf(",", 0)) < 1) break;
            if (e = e.substring(o + 1), 0 === e.length) break
        }
        return i.length < n ? (a = new Array(n), copy_(a, i), a) : i
    }
    for (i = int2bigInt(0, t * c, 0), r = 0; r < c && (o = digitsStr.indexOf(e.substring(r, r + 1), 0), t <= 36 && o >= 36 && (o -= 26), !(o >= t || o < 0)); r++) multInt_(i, t), addInt_(i, o);
    for (c = i.length; c > 0 && !i[c - 1]; c--) ;
    for (c = n > c + 1 ? n : c + 1, a = new Array(c), s = c < i.length ? c : i.length, r = 0; r < s; r++) a[r] = i[r];
    for (; r < c; r++) a[r] = 0;
    return a
}

function equalsInt(e, t) {
    var n;
    if (e[0] !== t) return 0;
    for (n = 1; n < e.length; n++) if (e[n]) return 0;
    return 1
}

function equals(e, t) {
    var n, o = e.length < t.length ? e.length : t.length;
    for (n = 0; n < o; n++) if (e[n] !== t[n]) return 0;
    if (e.length > t.length) {
        for (; n < e.length; n++) if (e[n]) return 0
    } else for (; n < t.length; n++) if (t[n]) return 0;
    return 1
}

function isZero(e) {
    var t;
    for (t = 0; t < e.length; t++) if (e[t]) return 0;
    return 1
}

function bigInt2str(e, t) {
    var n, o, r = "";
    if (s6.length !== e.length ? s6 = dup(e) : copy_(s6, e), -1 === t) {
        for (n = e.length - 1; n > 0; n--) r += e[n] + ",";
        r += e[0]
    } else for (; !isZero(s6);) o = divInt_(s6, t), r = digitsStr.substring(o, o + 1) + r;
    return 0 === r.length && (r = "0"), r
}

function dup(e) {
    return buff = new Array(e.length), copy_(buff, e), buff
}

function copy_(e, t) {
    var n, o = e.length < t.length ? e.length : t.length;
    for (n = 0; n < o; n++) e[n] = t[n];
    for (n = o; n < e.length; n++) e[n] = 0
}

function copyInt_(e, t) {
    var n, o;
    for (o = t, n = 0; n < e.length; n++) e[n] = o & mask, o >>= bpe
}

function addInt_(e, t) {
    var n, o, r, i;
    for (e[0] += t, o = e.length, r = 0, n = 0; n < o; n++) if (r += e[n], i = 0, r < 0 && (i = -(r >> bpe), r += i * radix), e[n] = r & mask, !(r = (r >> bpe) - i)) return
}

function rightShift_(e, t) {
    var n, o = Math.floor(t / bpe);
    if (o) {
        for (n = 0; n < e.length - o; n++) e[n] = e[n + o];
        for (; n < e.length; n++) e[n] = 0;
        t %= bpe
    }
    for (n = 0; n < e.length - 1; n++) e[n] = mask & (e[n + 1] << bpe - t | e[n] >> t);
    e[n] >>= t
}

function halve_(e) {
    var t;
    for (t = 0; t < e.length - 1; t++) e[t] = mask & (e[t + 1] << bpe - 1 | e[t] >> 1);
    e[t] = e[t] >> 1 | e[t] & radix >> 1
}

function leftShift_(e, t) {
    var n, o = Math.floor(t / bpe);
    if (o) {
        for (n = e.length; n >= o; n--) e[n] = e[n - o];
        for (; n >= 0; n--) e[n] = 0;
        t %= bpe
    }
    if (t) {
        for (n = e.length - 1; n > 0; n--) e[n] = mask & (e[n] << t | e[n - 1] >> bpe - t);
        e[n] = mask & e[n] << t
    }
}

function multInt_(e, t) {
    var n, o, r, i;
    if (t) for (o = e.length, r = 0, n = 0; n < o; n++) r += e[n] * t, i = 0, r < 0 && (i = -(r >> bpe), r += i * radix), e[n] = r & mask, r = (r >> bpe) - i
}

function divInt_(e, t) {
    var n, o, r = 0;
    for (n = e.length - 1; n >= 0; n--) o = r * radix + e[n], e[n] = Math.floor(o / t), r = o % t;
    return r
}

function linComb_(e, t, n, o) {
    var r, i, a, s;
    for (a = e.length < t.length ? e.length : t.length, s = e.length, i = 0, r = 0; r < a; r++) i += n * e[r] + o * t[r], e[r] = i & mask, i >>= bpe;
    for (r = a; r < s; r++) i += n * e[r], e[r] = i & mask, i >>= bpe
}

function linCombShift_(e, t, n, o) {
    var r, i, a, s;
    for (a = e.length < o + t.length ? e.length : o + t.length, s = e.length, i = 0, r = o; r < a; r++) i += e[r] + n * t[r - o], e[r] = i & mask, i >>= bpe;
    for (r = a; i && r < s; r++) i += e[r], e[r] = i & mask, i >>= bpe
}

function addShift_(e, t, n) {
    var o, r, i, a;
    for (i = e.length < n + t.length ? e.length : n + t.length, a = e.length, r = 0, o = n; o < i; o++) r += e[o] + t[o - n], e[o] = r & mask, r >>= bpe;
    for (o = i; r && o < a; o++) r += e[o], e[o] = r & mask, r >>= bpe
}

function subShift_(e, t, n) {
    var o, r, i, a;
    for (i = e.length < n + t.length ? e.length : n + t.length, a = e.length, r = 0, o = n; o < i; o++) r += e[o] - t[o - n], e[o] = r & mask, r >>= bpe;
    for (o = i; r && o < a; o++) r += e[o], e[o] = r & mask, r >>= bpe
}

function sub_(e, t) {
    var n, o, r;
    for (r = e.length < t.length ? e.length : t.length, o = 0, n = 0; n < r; n++) o += e[n] - t[n], e[n] = o & mask, o >>= bpe;
    for (n = r; o && n < e.length; n++) o += e[n], e[n] = o & mask, o >>= bpe
}

function add_(e, t) {
    var n, o, r;
    for (r = e.length < t.length ? e.length : t.length, o = 0, n = 0; n < r; n++) o += e[n] + t[n], e[n] = o & mask, o >>= bpe;
    for (n = r; o && n < e.length; n++) o += e[n], e[n] = o & mask, o >>= bpe
}

function mult_(e, t) {
    var n;
    for (ss.length !== 2 * e.length && (ss = new Array(2 * e.length)), copyInt_(ss, 0), n = 0; n < t.length; n++) t[n] && linCombShift_(ss, e, t[n], n);
    copy_(e, ss)
}

function mod_(e, t) {
    s4.length !== e.length ? s4 = dup(e) : copy_(s4, e), s5.length !== e.length && (s5 = dup(e)), divide_(s4, t, s5, e)
}

function multMod_(e, t, n) {
    var o;
    for (s0.length !== 2 * e.length && (s0 = new Array(2 * e.length)), copyInt_(s0, 0), o = 0; o < t.length; o++) t[o] && linCombShift_(s0, e, t[o], o);
    mod_(s0, n), copy_(e, s0)
}

function squareMod_(e, t) {
    var n, o, r, i, a;
    for (i = e.length; i > 0 && !e[i - 1]; i--) ;
    for (a = i > t.length ? 2 * i : 2 * t.length, s0.length !== a && (s0 = new Array(a)), copyInt_(s0, 0), n = 0; n < i; n++) {
        for (r = s0[2 * n] + e[n] * e[n], s0[2 * n] = r & mask, r >>= bpe, o = n + 1; o < i; o++) r = s0[n + o] + 2 * e[n] * e[o] + r, s0[n + o] = r & mask, r >>= bpe;
        s0[n + i] = r
    }
    mod_(s0, t), copy_(e, s0)
}

function trim(e, t) {
    var n, o;
    for (n = e.length; n > 0 && !e[n - 1]; n--) ;
    return o = new Array(n + t), copy_(o, e), o
}

function powMod_(e, t, n) {
    var o, r, i, a;
    if (s7.length !== n.length && (s7 = dup(n)), 0 !== (1 & n[0])) {
        for (copyInt_(s7, 0), i = n.length; i > 0 && !n[i - 1]; i--) ;
        for (a = radix - inverseModInt(modInt(n, radix), radix), s7[i] = 1, multMod_(e, s7, n), s3.length !== e.length ? s3 = dup(e) : copy_(s3, e), o = t.length - 1; o > 0 & !t[o]; o--) ;
        if (0 === t[o]) return void copyInt_(e, 1);
        for (r = 1 << bpe - 1; r && !(t[o] & r); r >>= 1) ;
        for (; ;) {
            if (!(r >>= 1)) {
                if (--o < 0) return void mont_(e, one, n, a);
                r = 1 << bpe - 1
            }
            mont_(e, e, n, a), r & t[o] && mont_(e, s3, n, a)
        }
    } else for (copy_(s7, e), copyInt_(e, 1); !equalsInt(t, 0);) 1 & t[0] && multMod_(e, s7, n), divInt_(t, 2), squareMod_(s7, n)
}

function mont_(e, t, n, o) {
    var r, i, a, s, c, l, u = n.length, d = t.length;
    for (sa.length !== u && (sa = new Array(u)), copyInt_(sa, 0); u > 0 && 0 === n[u - 1]; u--) ;
    for (; d > 0 && 0 === t[d - 1]; d--) ;
    for (l = sa.length - 1, r = 0; r < u; r++) {
        for (c = sa[0] + e[r] * t[0], s = (c & mask) * o & mask, a = c + s * n[0] >> bpe, c = e[r], i = 1; i < d - 4;) a += sa[i] + s * n[i] + c * t[i], sa[i - 1] = a & mask, a >>= bpe, i++, a += sa[i] + s * n[i] + c * t[i], sa[i - 1] = a & mask, a >>= bpe, i++, a += sa[i] + s * n[i] + c * t[i], sa[i - 1] = a & mask, a >>= bpe, i++, a += sa[i] + s * n[i] + c * t[i], sa[i - 1] = a & mask, a >>= bpe, i++, a += sa[i] + s * n[i] + c * t[i], sa[i - 1] = a & mask, a >>= bpe, i++;
        for (; i < d;) a += sa[i] + s * n[i] + c * t[i], sa[i - 1] = a & mask, a >>= bpe, i++;
        for (; i < u - 4;) a += sa[i] + s * n[i], sa[i - 1] = a & mask, a >>= bpe, i++, a += sa[i] + s * n[i], sa[i - 1] = a & mask, a >>= bpe, i++, a += sa[i] + s * n[i], sa[i - 1] = a & mask, a >>= bpe, i++, a += sa[i] + s * n[i], sa[i - 1] = a & mask, a >>= bpe, i++, a += sa[i] + s * n[i], sa[i - 1] = a & mask, a >>= bpe, i++;
        for (; i < u;) a += sa[i] + s * n[i], sa[i - 1] = a & mask, a >>= bpe, i++;
        for (; i < l;) a += sa[i], sa[i - 1] = a & mask, a >>= bpe, i++;
        sa[i - 1] = a & mask
    }
    greater(n, sa) || sub_(sa, n), copy_(e, sa)
}

for ("function" !== typeof Object.assign && (Object.assign = function (e, t) {
    if (null == e) throw new TypeError("Cannot convert undefined or null to object");
    for (var n = Object(e), o = 1; o < arguments.length; o++) {
        var r = arguments[o];
        if (r) for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (n[i] = r[i])
    }
    return n
}), function () {
    if (window.localStorage && window.sessionStorage) {
        var e = ["sessionStorage", "localStorage"];
        for (var t in e) XPMobileSDK[e[t]] = {
            storage: window[e[t]], setItem: function (e, t, n) {
                if (n) {
                    var o = {value: t, expiration: (new Date()).getTime() + n};
                    return void this.storage.setItem(e, "expiration::" + JSON.stringify(o))
                }
                return "boolean" === typeof t ? void this.storage.setItem(e, "boolean::" + t) : "number" === typeof t ? void this.storage.setItem(e, "number::" + t) : "object" === typeof t ? void this.storage.setItem(e, "object::" + JSON.stringify(t)) : void this.storage.setItem(e, t)
            }, getItem: function (e) {
                var t = this.storage.getItem(e);
                if (null === t) return null;
                if (0 === t.indexOf("expiration::")) {
                    var n = JSON.parse(t.substr(t.indexOf("::") + 2));
                    return (new Date()).getTime() > n.expiration ? (this.storage.removeItem(e), null) : n.value
                }
                return 0 === t.indexOf("boolean::") ? "boolean::true" === t : 0 === t.indexOf("number::") ? parseFloat(t.substr(t.indexOf("::") + 2)) : 0 === t.indexOf("object::") ? JSON.parse(t.substr(t.indexOf("::") + 2)) : t
            }, removeItem: function (e) {
                this.storage.removeItem(e)
            }, clear: function () {
                this.storage.clear()
            }, key: function (e) {
                return this.storage.key(e)
            }
        }
    }
}(), bpe = 0, mask = 0, radix = mask + 1, digitsStr = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_=!@#$%^&*()[]{}|;:,.<>/?`~ \\'\"+-", bpe = 0; 1 << bpe + 1 > 1 << bpe; bpe++) ;
bpe >>= 1, mask = (1 << bpe) - 1, radix = mask + 1, one = int2bigInt(1, 1, 1), t = new Array(0), ss = t, s0 = t, s1 = t, s2 = t, s3 = t, s4 = t, s5 = t, s6 = t, s7 = t, T = t, sa = t, mr_x1 = t, mr_r = t, mr_a = t, eg_v = t, eg_u = t, eg_A = t, eg_B = t, eg_C = t, eg_D = t, md_q1 = t, md_q2 = t, md_q3 = t, md_r = t, md_r1 = t, md_r2 = t, md_tt = t, primes = t, pows = t, s_i = t, s_i2 = t, s_R = t, s_rm = t, s_q = t, s_n1 = t, s_a = t, s_r2 = t, s_n = t, s_b = t, s_d = t, s_x1 = t, s_x2 = t, s_aa = t, rpprb = t;
var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) {
        for (var t, n, o, r, i, a, s, c = "", l = 0; l < e.length;) t = e.charCodeAt(l++), n = e.charCodeAt(l++), o = e.charCodeAt(l++), r = t >> 2, i = (3 & t) << 4 | n >> 4, a = (15 & n) << 2 | o >> 6, s = 63 & o, isNaN(n) ? a = s = 64 : isNaN(o) && (s = 64), c = c + this._keyStr.charAt(r) + this._keyStr.charAt(i) + this._keyStr.charAt(a) + this._keyStr.charAt(s);
        return c
    }, encodeArray: function (e) {
        for (var t, n, o, r, i, a, s, c = "", l = 0; l < e.length;) t = e[l++], n = e[l++], o = e[l++], r = t >> 2, i = (3 & t) << 4 | n >> 4, a = (15 & n) << 2 | o >> 6, s = 63 & o, isNaN(n) ? a = s = 64 : isNaN(o) && (s = 64), c = c + this._keyStr.charAt(r) + this._keyStr.charAt(i) + this._keyStr.charAt(a) + this._keyStr.charAt(s);
        return c
    }, decode: function (e) {
        var t, n, o, r, i, a, s, c = "", l = 0;
        for (e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); l < e.length;) r = this._keyStr.indexOf(e.charAt(l++)), i = this._keyStr.indexOf(e.charAt(l++)), a = this._keyStr.indexOf(e.charAt(l++)), s = this._keyStr.indexOf(e.charAt(l++)), t = r << 2 | i >> 4, n = (15 & i) << 4 | a >> 2, o = (3 & a) << 6 | s, c += String.fromCharCode(t), 64 != a && (c += String.fromCharCode(n)), 64 != s && (c += String.fromCharCode(o));
        return c = Base64._utf8_decode(c)
    }, decodeBinary: function (e, t) {
        !function () {
            function e(e, t) {
                return this.slice(e, t)
            }

            function t(e, t) {
                arguments.length < 2 && (t = 0);
                for (var n = 0, o = e.length; n < o; ++n, ++t) this[t] = 255 & e[n]
            }

            function n(n) {
                var o;
                if ("number" === typeof n) {
                    o = new Array(n);
                    for (var r = 0; r < n; ++r) o[r] = 0
                } else o = n.slice(0);
                return o.subarray = e, o.buffer = o, o.byteLength = o.length, o.set = t, "object" === typeof n && n.buffer && (o.buffer = n.buffer), o
            }

            try {
                new Uint8Array(1);
                return
            } catch (e) {
            }
            window.Uint8Array = n, window.Uint32Array = n, window.Int32Array = n
        }();
        var n = this._keyStr.indexOf(e.charAt(e.length - 1)), o = this._keyStr.indexOf(e.charAt(e.length - 2)),
            r = e.length / 4 * 3;
        64 == n && r--, 64 == o && r--;
        var i, a, s, c, l, u, d, f, h = 0, m = 0;
        for (i = t ? new Uint8Array(t) : new Uint8Array(r), e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""), h = 0; h < r; h += 3) l = this._keyStr.indexOf(e.charAt(m++)), u = this._keyStr.indexOf(e.charAt(m++)), d = this._keyStr.indexOf(e.charAt(m++)), f = this._keyStr.indexOf(e.charAt(m++)), a = l << 2 | u >> 4, s = (15 & u) << 4 | d >> 2, c = (3 & d) << 6 | f, i[h] = a, 64 != d && (i[h + 1] = s), 64 != f && (i[h + 2] = c);
        return i
    }, _utf8_encode: function (e) {
        e = e.replace(/\r\n/g, "\n");
        for (var t = "", n = 0; n < e.length; n++) {
            var o = e.charCodeAt(n);
            o < 128 ? t += String.fromCharCode(o) : o > 127 && o < 2048 ? (t += String.fromCharCode(o >> 6 | 192), t += String.fromCharCode(63 & o | 128)) : (t += String.fromCharCode(o >> 12 | 224), t += String.fromCharCode(o >> 6 & 63 | 128), t += String.fromCharCode(63 & o | 128))
        }
        return t
    }, _utf8_decode: function (e) {
        for (var t = "", n = 0, o = c1 = c2 = 0; n < e.length;) o = e.charCodeAt(n), o < 128 ? (t += String.fromCharCode(o), n++) : o > 191 && o < 224 ? (c2 = e.charCodeAt(n + 1), t += String.fromCharCode((31 & o) << 6 | 63 & c2), n += 2) : (c2 = e.charCodeAt(n + 1), c3 = e.charCodeAt(n + 2), t += String.fromCharCode((15 & o) << 12 | (63 & c2) << 6 | 63 & c3), n += 3);
        return t
    }
}, CryptoJS = CryptoJS || function (e, t) {
    var n = {}, o = n.lib = {}, r = function () {
    }, i = o.Base = {
        extend: function (e) {
            r.prototype = this;
            var t = new r();
            return e && t.mixIn(e), t.hasOwnProperty("init") || (t.init = function () {
                t.$super.init.apply(this, arguments)
            }), t.init.prototype = t, t.$super = this, t
        }, create: function () {
            var e = this.extend();
            return e.init.apply(e, arguments), e
        }, init: function () {
        }, mixIn: function (e) {
            for (var t in e) e.hasOwnProperty(t) && (this[t] = e[t]);
            e.hasOwnProperty("toString") && (this.toString = e.toString)
        }, clone: function () {
            return this.init.prototype.extend(this)
        }
    }, a = o.WordArray = i.extend({
        init: function (e, t) {
            e = this.words = e || [], this.sigBytes = void 0 !== t ? t : 4 * e.length
        }, toString: function (e) {
            return (e || c).stringify(this)
        }, concat: function (e) {
            var t = this.words, n = e.words, o = this.sigBytes;
            if (e = e.sigBytes, this.clamp(), o % 4) for (var r = 0; r < e; r++) t[o + r >>> 2] |= (n[r >>> 2] >>> 24 - r % 4 * 8 & 255) << 24 - (o + r) % 4 * 8; else if (65535 < n.length) for (r = 0; r < e; r += 4) t[o + r >>> 2] = n[r >>> 2]; else t.push.apply(t, n);
            return this.sigBytes += e, this
        }, clamp: function () {
            var t = this.words, n = this.sigBytes;
            t[n >>> 2] &= 4294967295 << 32 - n % 4 * 8, t.length = e.ceil(n / 4)
        }, clone: function () {
            var e = i.clone.call(this);
            return e.words = this.words.slice(0), e
        }, random: function (t) {
            for (var n = [], o = 0; o < t; o += 4) n.push(4294967296 * e.random() | 0);
            return new a.init(n, t)
        }
    }), s = n.enc = {}, c = s.Hex = {
        stringify: function (e) {
            var t = e.words;
            e = e.sigBytes;
            for (var n = [], o = 0; o < e; o++) {
                var r = t[o >>> 2] >>> 24 - o % 4 * 8 & 255;
                n.push((r >>> 4).toString(16)), n.push((15 & r).toString(16))
            }
            return n.join("")
        }, parse: function (e) {
            for (var t = e.length, n = [], o = 0; o < t; o += 2) n[o >>> 3] |= parseInt(e.substr(o, 2), 16) << 24 - o % 8 * 4;
            return new a.init(n, t / 2)
        }
    }, l = s.Latin1 = {
        stringify: function (e) {
            var t = e.words;
            e = e.sigBytes;
            for (var n = [], o = 0; o < e; o++) n.push(String.fromCharCode(t[o >>> 2] >>> 24 - o % 4 * 8 & 255));
            return n.join("")
        }, parse: function (e) {
            for (var t = e.length, n = [], o = 0; o < t; o++) n[o >>> 2] |= (255 & e.charCodeAt(o)) << 24 - o % 4 * 8;
            return new a.init(n, t)
        }
    }, u = s.Utf8 = {
        stringify: function (e) {
            try {
                return decodeURIComponent(escape(l.stringify(e)))
            } catch (e) {
                throw Error("Malformed UTF-8 data")
            }
        }, parse: function (e) {
            return l.parse(unescape(encodeURIComponent(e)))
        }
    }, d = o.BufferedBlockAlgorithm = i.extend({
        reset: function () {
            this._data = new a.init(), this._nDataBytes = 0
        }, _append: function (e) {
            "string" === typeof e && (e = u.parse(e)), this._data.concat(e), this._nDataBytes += e.sigBytes
        }, _process: function (t) {
            var n = this._data, o = n.words, r = n.sigBytes, i = this.blockSize, s = r / (4 * i),
                s = t ? e.ceil(s) : e.max((0 | s) - this._minBufferSize, 0);
            if (t = s * i, r = e.min(4 * t, r), t) {
                for (var c = 0; c < t; c += i) this._doProcessBlock(o, c);
                c = o.splice(0, t), n.sigBytes -= r
            }
            return new a.init(c, r)
        }, clone: function () {
            var e = i.clone.call(this);
            return e._data = this._data.clone(), e
        }, _minBufferSize: 0
    });
    o.Hasher = d.extend({
        cfg: i.extend(), init: function (e) {
            this.cfg = this.cfg.extend(e), this.reset()
        }, reset: function () {
            d.reset.call(this), this._doReset()
        }, update: function (e) {
            return this._append(e), this._process(), this
        }, finalize: function (e) {
            return e && this._append(e), this._doFinalize()
        }, blockSize: 16, _createHelper: function (e) {
            return function (t, n) {
                return new e.init(n).finalize(t)
            }
        }, _createHmacHelper: function (e) {
            return function (t, n) {
                return new f.HMAC.init(e, n).finalize(t)
            }
        }
    });
    var f = n.algo = {};
    return n
}(Math);
!function () {
    var e = CryptoJS, t = e.lib.WordArray;
    e.enc.Base64 = {
        stringify: function (e) {
            var t = e.words, n = e.sigBytes, o = this._map;
            e.clamp(), e = [];
            for (var r = 0; r < n; r += 3) for (var i = (t[r >>> 2] >>> 24 - r % 4 * 8 & 255) << 16 | (t[r + 1 >>> 2] >>> 24 - (r + 1) % 4 * 8 & 255) << 8 | t[r + 2 >>> 2] >>> 24 - (r + 2) % 4 * 8 & 255, a = 0; 4 > a && r + .75 * a < n; a++) e.push(o.charAt(i >>> 6 * (3 - a) & 63));
            if (t = o.charAt(64)) for (; e.length % 4;) e.push(t);
            return e.join("")
        }, parse: function (e) {
            var n = e.length, o = this._map, r = o.charAt(64);
            r && -1 !== (r = e.indexOf(r)) && (n = r);
            for (var r = [], i = 0, a = 0; a < n; a++) if (a % 4) {
                var s = o.indexOf(e.charAt(a - 1)) << a % 4 * 2, c = o.indexOf(e.charAt(a)) >>> 6 - a % 4 * 2;
                r[i >>> 2] |= (s | c) << 24 - i % 4 * 8, i++
            }
            return t.create(r, i)
        }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
    }
}(), function (e) {
    function t(e, t, n, o, r, i, a) {
        return ((e = e + (t & n | ~t & o) + r + a) << i | e >>> 32 - i) + t
    }

    function n(e, t, n, o, r, i, a) {
        return ((e = e + (t & o | n & ~o) + r + a) << i | e >>> 32 - i) + t
    }

    function o(e, t, n, o, r, i, a) {
        return ((e = e + (t ^ n ^ o) + r + a) << i | e >>> 32 - i) + t
    }

    function r(e, t, n, o, r, i, a) {
        return ((e = e + (n ^ (t | ~o)) + r + a) << i | e >>> 32 - i) + t
    }

    for (var i = CryptoJS, a = i.lib, s = a.WordArray, c = a.Hasher, a = i.algo, l = [], u = 0; 64 > u; u++) l[u] = 4294967296 * e.abs(e.sin(u + 1)) | 0;
    a = a.MD5 = c.extend({
        _doReset: function () {
            this._hash = new s.init([1732584193, 4023233417, 2562383102, 271733878])
        }, _doProcessBlock: function (e, i) {
            for (var a = 0; 16 > a; a++) {
                var s = i + a, c = e[s];
                e[s] = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8)
            }
            var a = this._hash.words, s = e[i + 0], c = e[i + 1], u = e[i + 2], d = e[i + 3], f = e[i + 4],
                h = e[i + 5], m = e[i + 6], g = e[i + 7], p = e[i + 8], b = e[i + 9], v = e[i + 10], C = e[i + 11],
                S = e[i + 12], y = e[i + 13], _ = e[i + 14], I = e[i + 15], P = a[0], k = a[1], D = a[2], E = a[3],
                P = t(P, k, D, E, s, 7, l[0]), E = t(E, P, k, D, c, 12, l[1]), D = t(D, E, P, k, u, 17, l[2]),
                k = t(k, D, E, P, d, 22, l[3]), P = t(P, k, D, E, f, 7, l[4]), E = t(E, P, k, D, h, 12, l[5]),
                D = t(D, E, P, k, m, 17, l[6]), k = t(k, D, E, P, g, 22, l[7]), P = t(P, k, D, E, p, 7, l[8]),
                E = t(E, P, k, D, b, 12, l[9]), D = t(D, E, P, k, v, 17, l[10]), k = t(k, D, E, P, C, 22, l[11]),
                P = t(P, k, D, E, S, 7, l[12]), E = t(E, P, k, D, y, 12, l[13]), D = t(D, E, P, k, _, 17, l[14]),
                k = t(k, D, E, P, I, 22, l[15]), P = n(P, k, D, E, c, 5, l[16]), E = n(E, P, k, D, m, 9, l[17]),
                D = n(D, E, P, k, C, 14, l[18]), k = n(k, D, E, P, s, 20, l[19]), P = n(P, k, D, E, h, 5, l[20]),
                E = n(E, P, k, D, v, 9, l[21]), D = n(D, E, P, k, I, 14, l[22]), k = n(k, D, E, P, f, 20, l[23]),
                P = n(P, k, D, E, b, 5, l[24]), E = n(E, P, k, D, _, 9, l[25]), D = n(D, E, P, k, d, 14, l[26]),
                k = n(k, D, E, P, p, 20, l[27]), P = n(P, k, D, E, y, 5, l[28]), E = n(E, P, k, D, u, 9, l[29]),
                D = n(D, E, P, k, g, 14, l[30]), k = n(k, D, E, P, S, 20, l[31]), P = o(P, k, D, E, h, 4, l[32]),
                E = o(E, P, k, D, p, 11, l[33]), D = o(D, E, P, k, C, 16, l[34]), k = o(k, D, E, P, _, 23, l[35]),
                P = o(P, k, D, E, c, 4, l[36]), E = o(E, P, k, D, f, 11, l[37]), D = o(D, E, P, k, g, 16, l[38]),
                k = o(k, D, E, P, v, 23, l[39]), P = o(P, k, D, E, y, 4, l[40]), E = o(E, P, k, D, s, 11, l[41]),
                D = o(D, E, P, k, d, 16, l[42]), k = o(k, D, E, P, m, 23, l[43]), P = o(P, k, D, E, b, 4, l[44]),
                E = o(E, P, k, D, S, 11, l[45]), D = o(D, E, P, k, I, 16, l[46]), k = o(k, D, E, P, u, 23, l[47]),
                P = r(P, k, D, E, s, 6, l[48]), E = r(E, P, k, D, g, 10, l[49]), D = r(D, E, P, k, _, 15, l[50]),
                k = r(k, D, E, P, h, 21, l[51]), P = r(P, k, D, E, S, 6, l[52]), E = r(E, P, k, D, d, 10, l[53]),
                D = r(D, E, P, k, v, 15, l[54]), k = r(k, D, E, P, c, 21, l[55]), P = r(P, k, D, E, p, 6, l[56]),
                E = r(E, P, k, D, I, 10, l[57]), D = r(D, E, P, k, m, 15, l[58]), k = r(k, D, E, P, y, 21, l[59]),
                P = r(P, k, D, E, f, 6, l[60]), E = r(E, P, k, D, C, 10, l[61]), D = r(D, E, P, k, u, 15, l[62]),
                k = r(k, D, E, P, b, 21, l[63]);
            a[0] = a[0] + P | 0, a[1] = a[1] + k | 0, a[2] = a[2] + D | 0, a[3] = a[3] + E | 0
        }, _doFinalize: function () {
            var t = this._data, n = t.words, o = 8 * this._nDataBytes, r = 8 * t.sigBytes;
            n[r >>> 5] |= 128 << 24 - r % 32;
            var i = e.floor(o / 4294967296);
            for (n[15 + (r + 64 >>> 9 << 4)] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8), n[14 + (r + 64 >>> 9 << 4)] = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8), t.sigBytes = 4 * (n.length + 1), this._process(), t = this._hash, n = t.words, o = 0; 4 > o; o++) r = n[o], n[o] = 16711935 & (r << 8 | r >>> 24) | 4278255360 & (r << 24 | r >>> 8);
            return t
        }, clone: function () {
            var e = c.clone.call(this);
            return e._hash = this._hash.clone(), e
        }
    }), i.MD5 = c._createHelper(a), i.HmacMD5 = c._createHmacHelper(a)
}(Math), function () {
    var e = CryptoJS, t = e.lib, n = t.Base, o = t.WordArray, t = e.algo, r = t.EvpKDF = n.extend({
        cfg: n.extend({keySize: 4, hasher: t.MD5, iterations: 1}), init: function (e) {
            this.cfg = this.cfg.extend(e)
        }, compute: function (e, t) {
            for (var n = this.cfg, r = n.hasher.create(), i = o.create(), a = i.words, s = n.keySize, n = n.iterations; a.length < s;) {
                c && r.update(c);
                var c = r.update(e).finalize(t);
                r.reset();
                for (var l = 1; l < n; l++) c = r.finalize(c), r.reset();
                i.concat(c)
            }
            return i.sigBytes = 4 * s, i
        }
    });
    e.EvpKDF = function (e, t, n) {
        return r.create(n).compute(e, t)
    }
}(), CryptoJS.lib.Cipher || function (e) {
    var t = CryptoJS, n = t.lib, o = n.Base, r = n.WordArray, i = n.BufferedBlockAlgorithm, a = t.enc.Base64,
        s = t.algo.EvpKDF, c = n.Cipher = i.extend({
            cfg: o.extend(), createEncryptor: function (e, t) {
                return this.create(this._ENC_XFORM_MODE, e, t)
            }, createDecryptor: function (e, t) {
                return this.create(this._DEC_XFORM_MODE, e, t)
            }, init: function (e, t, n) {
                this.cfg = this.cfg.extend(n), this._xformMode = e, this._key = t, this.reset()
            }, reset: function () {
                i.reset.call(this), this._doReset()
            }, process: function (e) {
                return this._append(e), this._process()
            }, finalize: function (e) {
                return e && this._append(e), this._doFinalize()
            }, keySize: 4, ivSize: 4, _ENC_XFORM_MODE: 1, _DEC_XFORM_MODE: 2, _createHelper: function (e) {
                return {
                    encrypt: function (t, n, o) {
                        return ("string" === typeof n ? m : h).encrypt(e, t, n, o)
                    }, decrypt: function (t, n, o) {
                        return ("string" === typeof n ? m : h).decrypt(e, t, n, o)
                    }
                }
            }
        });
    n.StreamCipher = c.extend({
        _doFinalize: function () {
            return this._process(!0)
        }, blockSize: 1
    });
    var l = t.mode = {}, u = function (e, t, n) {
        var o = this._iv;
        o ? this._iv = void 0 : o = this._prevBlock;
        for (var r = 0; r < n; r++) e[t + r] ^= o[r]
    }, d = (n.BlockCipherMode = o.extend({
        createEncryptor: function (e, t) {
            return this.Encryptor.create(e, t)
        }, createDecryptor: function (e, t) {
            return this.Decryptor.create(e, t)
        }, init: function (e, t) {
            this._cipher = e, this._iv = t
        }
    })).extend();
    d.Encryptor = d.extend({
        processBlock: function (e, t) {
            var n = this._cipher, o = n.blockSize;
            u.call(this, e, t, o), n.encryptBlock(e, t), this._prevBlock = e.slice(t, t + o)
        }
    }), d.Decryptor = d.extend({
        processBlock: function (e, t) {
            var n = this._cipher, o = n.blockSize, r = e.slice(t, t + o);
            n.decryptBlock(e, t), u.call(this, e, t, o), this._prevBlock = r
        }
    }), l = l.CBC = d, d = (t.pad = {}).Pkcs7 = {
        pad: function (e, t) {
            for (var n = 4 * t, n = n - e.sigBytes % n, o = n << 24 | n << 16 | n << 8 | n, i = [], a = 0; a < n; a += 4) i.push(o);
            n = r.create(i, n), e.concat(n)
        }, unpad: function (e) {
            e.sigBytes -= 255 & e.words[e.sigBytes - 1 >>> 2]
        }
    }, n.BlockCipher = c.extend({
        cfg: c.cfg.extend({mode: l, padding: d}), reset: function () {
            c.reset.call(this);
            var e = this.cfg, t = e.iv, e = e.mode;
            if (this._xformMode == this._ENC_XFORM_MODE) var n = e.createEncryptor; else n = e.createDecryptor, this._minBufferSize = 1;
            this._mode = n.call(e, this, t && t.words)
        }, _doProcessBlock: function (e, t) {
            this._mode.processBlock(e, t)
        }, _doFinalize: function () {
            var e = this.cfg.padding;
            if (this._xformMode === this._ENC_XFORM_MODE) {
                e.pad(this._data, this.blockSize);
                var t = this._process(!0)
            } else t = this._process(!0), e.unpad(t);
            return t
        }, blockSize: 4
    });
    var f = n.CipherParams = o.extend({
        init: function (e) {
            this.mixIn(e)
        }, toString: function (e) {
            return (e || this.formatter).stringify(this)
        }
    }), l = (t.format = {}).OpenSSL = {
        stringify: function (e) {
            var t = e.ciphertext;
            return e = e.salt, (e ? r.create([1398893684, 1701076831]).concat(e).concat(t) : t).toString(a)
        }, parse: function (e) {
            e = a.parse(e);
            var t = e.words;
            if (1398893684 === t[0] && 1701076831 === t[1]) {
                var n = r.create(t.slice(2, 4));
                t.splice(0, 4), e.sigBytes -= 16
            }
            return f.create({ciphertext: e, salt: n})
        }
    }, h = n.SerializableCipher = o.extend({
        cfg: o.extend({format: l}), encrypt: function (e, t, n, o) {
            o = this.cfg.extend(o);
            var r = e.createEncryptor(n, o);
            return t = r.finalize(t), r = r.cfg, f.create({
                ciphertext: t,
                key: n,
                iv: r.iv,
                algorithm: e,
                mode: r.mode,
                padding: r.padding,
                blockSize: e.blockSize,
                formatter: o.format
            })
        }, decrypt: function (e, t, n, o) {
            return o = this.cfg.extend(o), t = this._parse(t, o.format), e.createDecryptor(n, o).finalize(t.ciphertext)
        }, _parse: function (e, t) {
            return "string" === typeof e ? t.parse(e, this) : e
        }
    }), t = (t.kdf = {}).OpenSSL = {
        execute: function (e, t, n, o) {
            return o || (o = r.random(8)), e = s.create({keySize: t + n}).compute(e, o), n = r.create(e.words.slice(t), 4 * n), e.sigBytes = 4 * t, f.create({
                key: e,
                iv: n,
                salt: o
            })
        }
    }, m = n.PasswordBasedCipher = h.extend({
        cfg: h.cfg.extend({kdf: t}), encrypt: function (e, t, n, o) {
            return o = this.cfg.extend(o), n = o.kdf.execute(n, e.keySize, e.ivSize), o.iv = n.iv, e = h.encrypt.call(this, e, t, n.key, o), e.mixIn(n), e
        }, decrypt: function (e, t, n, o) {
            return o = this.cfg.extend(o), t = this._parse(t, o.format), n = o.kdf.execute(n, e.keySize, e.ivSize, t.salt), o.iv = n.iv, h.decrypt.call(this, e, t, n.key, o)
        }
    })
}(), function () {
    for (var e = CryptoJS, t = e.lib.BlockCipher, n = e.algo, o = [], r = [], i = [], a = [], s = [], c = [], l = [], u = [], d = [], f = [], h = [], m = 0; 256 > m; m++) h[m] = 128 > m ? m << 1 : m << 1 ^ 283;
    for (var g = 0, p = 0, m = 0; 256 > m; m++) {
        var b = p ^ p << 1 ^ p << 2 ^ p << 3 ^ p << 4, b = b >>> 8 ^ 255 & b ^ 99;
        o[g] = b, r[b] = g;
        var v = h[g], C = h[v], S = h[C], y = 257 * h[b] ^ 16843008 * b;
        i[g] = y << 24 | y >>> 8, a[g] = y << 16 | y >>> 16, s[g] = y << 8 | y >>> 24, c[g] = y, y = 16843009 * S ^ 65537 * C ^ 257 * v ^ 16843008 * g, l[b] = y << 24 | y >>> 8, u[b] = y << 16 | y >>> 16, d[b] = y << 8 | y >>> 24, f[b] = y, g ? (g = v ^ h[h[h[S ^ v]]], p ^= h[h[p]]) : g = p = 1
    }
    var _ = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], n = n.AES = t.extend({
        _doReset: function () {
            for (var e = this._key, t = e.words, n = e.sigBytes / 4, e = 4 * ((this._nRounds = n + 6) + 1), r = this._keySchedule = [], i = 0; i < e; i++) if (i < n) r[i] = t[i]; else {
                var a = r[i - 1];
                i % n ? 6 < n && 4 === i % n && (a = o[a >>> 24] << 24 | o[a >>> 16 & 255] << 16 | o[a >>> 8 & 255] << 8 | o[255 & a]) : (a = a << 8 | a >>> 24, a = o[a >>> 24] << 24 | o[a >>> 16 & 255] << 16 | o[a >>> 8 & 255] << 8 | o[255 & a], a ^= _[i / n | 0] << 24), r[i] = r[i - n] ^ a
            }
            for (t = this._invKeySchedule = [], n = 0; n < e; n++) i = e - n, a = n % 4 ? r[i] : r[i - 4], t[n] = 4 > n || 4 >= i ? a : l[o[a >>> 24]] ^ u[o[a >>> 16 & 255]] ^ d[o[a >>> 8 & 255]] ^ f[o[255 & a]]
        }, encryptBlock: function (e, t) {
            this._doCryptBlock(e, t, this._keySchedule, i, a, s, c, o)
        }, decryptBlock: function (e, t) {
            var n = e[t + 1];
            e[t + 1] = e[t + 3], e[t + 3] = n, this._doCryptBlock(e, t, this._invKeySchedule, l, u, d, f, r), n = e[t + 1], e[t + 1] = e[t + 3], e[t + 3] = n
        }, _doCryptBlock: function (e, t, n, o, r, i, a, s) {
            for (var c = this._nRounds, l = e[t] ^ n[0], u = e[t + 1] ^ n[1], d = e[t + 2] ^ n[2], f = e[t + 3] ^ n[3], h = 4, m = 1; m < c; m++) var g = o[l >>> 24] ^ r[u >>> 16 & 255] ^ i[d >>> 8 & 255] ^ a[255 & f] ^ n[h++], p = o[u >>> 24] ^ r[d >>> 16 & 255] ^ i[f >>> 8 & 255] ^ a[255 & l] ^ n[h++], b = o[d >>> 24] ^ r[f >>> 16 & 255] ^ i[l >>> 8 & 255] ^ a[255 & u] ^ n[h++], f = o[f >>> 24] ^ r[l >>> 16 & 255] ^ i[u >>> 8 & 255] ^ a[255 & d] ^ n[h++], l = g, u = p, d = b;
            g = (s[l >>> 24] << 24 | s[u >>> 16 & 255] << 16 | s[d >>> 8 & 255] << 8 | s[255 & f]) ^ n[h++], p = (s[u >>> 24] << 24 | s[d >>> 16 & 255] << 16 | s[f >>> 8 & 255] << 8 | s[255 & l]) ^ n[h++],
                b = (s[d >>> 24] << 24 | s[f >>> 16 & 255] << 16 | s[l >>> 8 & 255] << 8 | s[255 & u]) ^ n[h++], f = (s[f >>> 24] << 24 | s[l >>> 16 & 255] << 16 | s[u >>> 8 & 255] << 8 | s[255 & d]) ^ n[h++], e[t] = g, e[t + 1] = p, e[t + 2] = b, e[t + 3] = f
        }, keySize: 8
    });
    e.AES = t._createHelper(n)
}();
var CryptoJS = CryptoJS || function (e, t) {
    var n = {}, o = n.lib = {}, r = function () {
    }, i = o.Base = {
        extend: function (e) {
            r.prototype = this;
            var t = new r();
            return e && t.mixIn(e), t.hasOwnProperty("init") || (t.init = function () {
                t.$super.init.apply(this, arguments)
            }), t.init.prototype = t, t.$super = this, t
        }, create: function () {
            var e = this.extend();
            return e.init.apply(e, arguments), e
        }, init: function () {
        }, mixIn: function (e) {
            for (var t in e) e.hasOwnProperty(t) && (this[t] = e[t]);
            e.hasOwnProperty("toString") && (this.toString = e.toString)
        }, clone: function () {
            return this.init.prototype.extend(this)
        }
    }, a = o.WordArray = i.extend({
        init: function (e, t) {
            e = this.words = e || [], this.sigBytes = void 0 != t ? t : 4 * e.length
        }, toString: function (e) {
            return (e || c).stringify(this)
        }, concat: function (e) {
            var t = this.words, n = e.words, o = this.sigBytes;
            if (e = e.sigBytes, this.clamp(), o % 4) for (var r = 0; r < e; r++) t[o + r >>> 2] |= (n[r >>> 2] >>> 24 - r % 4 * 8 & 255) << 24 - (o + r) % 4 * 8; else if (65535 < n.length) for (r = 0; r < e; r += 4) t[o + r >>> 2] = n[r >>> 2]; else t.push.apply(t, n);
            return this.sigBytes += e, this
        }, clamp: function () {
            var t = this.words, n = this.sigBytes;
            t[n >>> 2] &= 4294967295 << 32 - n % 4 * 8, t.length = e.ceil(n / 4)
        }, clone: function () {
            var e = i.clone.call(this);
            return e.words = this.words.slice(0), e
        }, random: function (t) {
            for (var n = [], o = 0; o < t; o += 4) n.push(4294967296 * e.random() | 0);
            return new a.init(n, t)
        }
    }), s = n.enc = {}, c = s.Hex = {
        stringify: function (e) {
            var t = e.words;
            e = e.sigBytes;
            for (var n = [], o = 0; o < e; o++) {
                var r = t[o >>> 2] >>> 24 - o % 4 * 8 & 255;
                n.push((r >>> 4).toString(16)), n.push((15 & r).toString(16))
            }
            return n.join("")
        }, parse: function (e) {
            for (var t = e.length, n = [], o = 0; o < t; o += 2) n[o >>> 3] |= parseInt(e.substr(o, 2), 16) << 24 - o % 8 * 4;
            return new a.init(n, t / 2)
        }
    }, l = s.Latin1 = {
        stringify: function (e) {
            var t = e.words;
            e = e.sigBytes;
            for (var n = [], o = 0; o < e; o++) n.push(String.fromCharCode(t[o >>> 2] >>> 24 - o % 4 * 8 & 255));
            return n.join("")
        }, parse: function (e) {
            for (var t = e.length, n = [], o = 0; o < t; o++) n[o >>> 2] |= (255 & e.charCodeAt(o)) << 24 - o % 4 * 8;
            return new a.init(n, t)
        }
    }, u = s.Utf8 = {
        stringify: function (e) {
            try {
                return decodeURIComponent(escape(l.stringify(e)))
            } catch (e) {
                throw Error("Malformed UTF-8 data")
            }
        }, parse: function (e) {
            return l.parse(unescape(encodeURIComponent(e)))
        }
    }, d = o.BufferedBlockAlgorithm = i.extend({
        reset: function () {
            this._data = new a.init(), this._nDataBytes = 0
        }, _append: function (e) {
            "string" === typeof e && (e = u.parse(e)), this._data.concat(e), this._nDataBytes += e.sigBytes
        }, _process: function (t) {
            var n = this._data, o = n.words, r = n.sigBytes, i = this.blockSize, s = r / (4 * i),
                s = t ? e.ceil(s) : e.max((0 | s) - this._minBufferSize, 0);
            if (t = s * i, r = e.min(4 * t, r), t) {
                for (var c = 0; c < t; c += i) this._doProcessBlock(o, c);
                c = o.splice(0, t), n.sigBytes -= r
            }
            return new a.init(c, r)
        }, clone: function () {
            var e = i.clone.call(this);
            return e._data = this._data.clone(), e
        }, _minBufferSize: 0
    });
    o.Hasher = d.extend({
        cfg: i.extend(), init: function (e) {
            this.cfg = this.cfg.extend(e), this.reset()
        }, reset: function () {
            d.reset.call(this), this._doReset()
        }, update: function (e) {
            return this._append(e), this._process(), this
        }, finalize: function (e) {
            return e && this._append(e), this._doFinalize()
        }, blockSize: 16, _createHelper: function (e) {
            return function (t, n) {
                return new e.init(n).finalize(t)
            }
        }, _createHmacHelper: function (e) {
            return function (t, n) {
                return new f.HMAC.init(e, n).finalize(t)
            }
        }
    });
    var f = n.algo = {};
    return n
}(Math);
!function (e) {
    for (var t = CryptoJS, n = t.lib, o = n.WordArray, r = n.Hasher, n = t.algo, i = [], a = [], s = function (e) {
        return 4294967296 * (e - (0 | e)) | 0
    }, c = 2, l = 0; 64 > l;) {
        var u;
        e:{
            u = c;
            for (var d = e.sqrt(u), f = 2; f <= d; f++) if (!(u % f)) {
                u = !1;
                break e
            }
            u = !0
        }
        u && (8 > l && (i[l] = s(e.pow(c, .5))), a[l] = s(e.pow(c, 1 / 3)), l++), c++
    }
    var h = [], n = n.SHA256 = r.extend({
        _doReset: function () {
            this._hash = new o.init(i.slice(0))
        }, _doProcessBlock: function (e, t) {
            for (var n = this._hash.words, o = n[0], r = n[1], i = n[2], s = n[3], c = n[4], l = n[5], u = n[6], d = n[7], f = 0; 64 > f; f++) {
                if (16 > f) h[f] = 0 | e[t + f]; else {
                    var m = h[f - 15], g = h[f - 2];
                    h[f] = ((m << 25 | m >>> 7) ^ (m << 14 | m >>> 18) ^ m >>> 3) + h[f - 7] + ((g << 15 | g >>> 17) ^ (g << 13 | g >>> 19) ^ g >>> 10) + h[f - 16]
                }
                m = d + ((c << 26 | c >>> 6) ^ (c << 21 | c >>> 11) ^ (c << 7 | c >>> 25)) + (c & l ^ ~c & u) + a[f] + h[f], g = ((o << 30 | o >>> 2) ^ (o << 19 | o >>> 13) ^ (o << 10 | o >>> 22)) + (o & r ^ o & i ^ r & i), d = u, u = l, l = c, c = s + m | 0, s = i, i = r, r = o, o = m + g | 0
            }
            n[0] = n[0] + o | 0, n[1] = n[1] + r | 0, n[2] = n[2] + i | 0, n[3] = n[3] + s | 0, n[4] = n[4] + c | 0, n[5] = n[5] + l | 0, n[6] = n[6] + u | 0, n[7] = n[7] + d | 0
        }, _doFinalize: function () {
            var t = this._data, n = t.words, o = 8 * this._nDataBytes, r = 8 * t.sigBytes;
            return n[r >>> 5] |= 128 << 24 - r % 32, n[14 + (r + 64 >>> 9 << 4)] = e.floor(o / 4294967296), n[15 + (r + 64 >>> 9 << 4)] = o, t.sigBytes = 4 * n.length, this._process(), this._hash
        }, clone: function () {
            var e = r.clone.call(this);
            return e._hash = this._hash.clone(), e
        }
    });
    t.SHA256 = r._createHelper(n), t.HmacSHA256 = r._createHmacHelper(n)
}(Math);
var CryptoJS = CryptoJS || function (e, t) {
    var n = {}, o = n.lib = {}, r = function () {
    }, i = o.Base = {
        extend: function (e) {
            r.prototype = this;
            var t = new r();
            return e && t.mixIn(e), t.hasOwnProperty("init") || (t.init = function () {
                t.$super.init.apply(this, arguments)
            }), t.init.prototype = t, t.$super = this, t
        }, create: function () {
            var e = this.extend();
            return e.init.apply(e, arguments), e
        }, init: function () {
        }, mixIn: function (e) {
            for (var t in e) e.hasOwnProperty(t) && (this[t] = e[t]);
            e.hasOwnProperty("toString") && (this.toString = e.toString)
        }, clone: function () {
            return this.init.prototype.extend(this)
        }
    }, a = o.WordArray = i.extend({
        init: function (e, t) {
            e = this.words = e || [], this.sigBytes = void 0 != t ? t : 4 * e.length
        }, toString: function (e) {
            return (e || c).stringify(this)
        }, concat: function (e) {
            var t = this.words, n = e.words, o = this.sigBytes;
            if (e = e.sigBytes, this.clamp(), o % 4) for (var r = 0; r < e; r++) t[o + r >>> 2] |= (n[r >>> 2] >>> 24 - r % 4 * 8 & 255) << 24 - (o + r) % 4 * 8; else if (65535 < n.length) for (r = 0; r < e; r += 4) t[o + r >>> 2] = n[r >>> 2]; else t.push.apply(t, n);
            return this.sigBytes += e, this
        }, clamp: function () {
            var t = this.words, n = this.sigBytes;
            t[n >>> 2] &= 4294967295 << 32 - n % 4 * 8, t.length = e.ceil(n / 4)
        }, clone: function () {
            var e = i.clone.call(this);
            return e.words = this.words.slice(0), e
        }, random: function (t) {
            for (var n = [], o = 0; o < t; o += 4) n.push(4294967296 * e.random() | 0);
            return new a.init(n, t)
        }
    }), s = n.enc = {}, c = s.Hex = {
        stringify: function (e) {
            var t = e.words;
            e = e.sigBytes;
            for (var n = [], o = 0; o < e; o++) {
                var r = t[o >>> 2] >>> 24 - o % 4 * 8 & 255;
                n.push((r >>> 4).toString(16)), n.push((15 & r).toString(16))
            }
            return n.join("")
        }, parse: function (e) {
            for (var t = e.length, n = [], o = 0; o < t; o += 2) n[o >>> 3] |= parseInt(e.substr(o, 2), 16) << 24 - o % 8 * 4;
            return new a.init(n, t / 2)
        }
    }, l = s.Latin1 = {
        stringify: function (e) {
            var t = e.words;
            e = e.sigBytes;
            for (var n = [], o = 0; o < e; o++) n.push(String.fromCharCode(t[o >>> 2] >>> 24 - o % 4 * 8 & 255));
            return n.join("")
        }, parse: function (e) {
            for (var t = e.length, n = [], o = 0; o < t; o++) n[o >>> 2] |= (255 & e.charCodeAt(o)) << 24 - o % 4 * 8;
            return new a.init(n, t)
        }
    }, u = s.Utf8 = {
        stringify: function (e) {
            try {
                return decodeURIComponent(escape(l.stringify(e)))
            } catch (e) {
                throw Error("Malformed UTF-8 data")
            }
        }, parse: function (e) {
            return l.parse(unescape(encodeURIComponent(e)))
        }
    }, d = o.BufferedBlockAlgorithm = i.extend({
        reset: function () {
            this._data = new a.init(), this._nDataBytes = 0
        }, _append: function (e) {
            "string" === typeof e && (e = u.parse(e)), this._data.concat(e), this._nDataBytes += e.sigBytes
        }, _process: function (t) {
            var n = this._data, o = n.words, r = n.sigBytes, i = this.blockSize, s = r / (4 * i),
                s = t ? e.ceil(s) : e.max((0 | s) - this._minBufferSize, 0);
            if (t = s * i, r = e.min(4 * t, r), t) {
                for (var c = 0; c < t; c += i) this._doProcessBlock(o, c);
                c = o.splice(0, t), n.sigBytes -= r
            }
            return new a.init(c, r)
        }, clone: function () {
            var e = i.clone.call(this);
            return e._data = this._data.clone(), e
        }, _minBufferSize: 0
    });
    o.Hasher = d.extend({
        cfg: i.extend(), init: function (e) {
            this.cfg = this.cfg.extend(e), this.reset()
        }, reset: function () {
            d.reset.call(this), this._doReset()
        }, update: function (e) {
            return this._append(e), this._process(), this
        }, finalize: function (e) {
            return e && this._append(e), this._doFinalize()
        }, blockSize: 16, _createHelper: function (e) {
            return function (t, n) {
                return new e.init(n).finalize(t)
            }
        }, _createHmacHelper: function (e) {
            return function (t, n) {
                return new f.HMAC.init(e, n).finalize(t)
            }
        }
    });
    var f = n.algo = {};
    return n
}(Math);
!function (e) {
    var t = CryptoJS, n = t.lib, o = n.Base, r = n.WordArray, t = t.x64 = {};
    t.Word = o.extend({
        init: function (e, t) {
            this.high = e, this.low = t
        }
    }), t.WordArray = o.extend({
        init: function (e, t) {
            e = this.words = e || [], this.sigBytes = void 0 != t ? t : 8 * e.length
        }, toX32: function () {
            for (var e = this.words, t = e.length, n = [], o = 0; o < t; o++) {
                var i = e[o];
                n.push(i.high), n.push(i.low)
            }
            return r.create(n, this.sigBytes)
        }, clone: function () {
            for (var e = o.clone.call(this), t = e.words = this.words.slice(0), n = t.length, r = 0; r < n; r++) t[r] = t[r].clone();
            return e
        }
    })
}(), function () {
    function e() {
        return r.create.apply(r, arguments)
    }

    for (var t = CryptoJS, n = t.lib.Hasher, o = t.x64, r = o.Word, i = o.WordArray, o = t.algo, a = [e(1116352408, 3609767458), e(1899447441, 602891725), e(3049323471, 3964484399), e(3921009573, 2173295548), e(961987163, 4081628472), e(1508970993, 3053834265), e(2453635748, 2937671579), e(2870763221, 3664609560), e(3624381080, 2734883394), e(310598401, 1164996542), e(607225278, 1323610764), e(1426881987, 3590304994), e(1925078388, 4068182383), e(2162078206, 991336113), e(2614888103, 633803317), e(3248222580, 3479774868), e(3835390401, 2666613458), e(4022224774, 944711139), e(264347078, 2341262773), e(604807628, 2007800933), e(770255983, 1495990901), e(1249150122, 1856431235), e(1555081692, 3175218132), e(1996064986, 2198950837), e(2554220882, 3999719339), e(2821834349, 766784016), e(2952996808, 2566594879), e(3210313671, 3203337956), e(3336571891, 1034457026), e(3584528711, 2466948901), e(113926993, 3758326383), e(338241895, 168717936), e(666307205, 1188179964), e(773529912, 1546045734), e(1294757372, 1522805485), e(1396182291, 2643833823), e(1695183700, 2343527390), e(1986661051, 1014477480), e(2177026350, 1206759142), e(2456956037, 344077627), e(2730485921, 1290863460), e(2820302411, 3158454273), e(3259730800, 3505952657), e(3345764771, 106217008), e(3516065817, 3606008344), e(3600352804, 1432725776), e(4094571909, 1467031594), e(275423344, 851169720), e(430227734, 3100823752), e(506948616, 1363258195), e(659060556, 3750685593), e(883997877, 3785050280), e(958139571, 3318307427), e(1322822218, 3812723403), e(1537002063, 2003034995), e(1747873779, 3602036899), e(1955562222, 1575990012), e(2024104815, 1125592928), e(2227730452, 2716904306), e(2361852424, 442776044), e(2428436474, 593698344), e(2756734187, 3733110249), e(3204031479, 2999351573), e(3329325298, 3815920427), e(3391569614, 3928383900), e(3515267271, 566280711), e(3940187606, 3454069534), e(4118630271, 4000239992), e(116418474, 1914138554), e(174292421, 2731055270), e(289380356, 3203993006), e(460393269, 320620315), e(685471733, 587496836), e(852142971, 1086792851), e(1017036298, 365543100), e(1126000580, 2618297676), e(1288033470, 3409855158), e(1501505948, 4234509866), e(1607167915, 987167468), e(1816402316, 1246189591)], s = [], c = 0; 80 > c; c++) s[c] = e();
    o = o.SHA512 = n.extend({
        _doReset: function () {
            this._hash = new i.init([new r.init(1779033703, 4089235720), new r.init(3144134277, 2227873595), new r.init(1013904242, 4271175723), new r.init(2773480762, 1595750129), new r.init(1359893119, 2917565137), new r.init(2600822924, 725511199), new r.init(528734635, 4215389547), new r.init(1541459225, 327033209)])
        }, _doProcessBlock: function (e, t) {
            for (var n = this._hash.words, o = n[0], r = n[1], i = n[2], c = n[3], l = n[4], u = n[5], d = n[6], n = n[7], f = o.high, h = o.low, m = r.high, g = r.low, p = i.high, b = i.low, v = c.high, C = c.low, S = l.high, y = l.low, _ = u.high, I = u.low, P = d.high, k = d.low, D = n.high, E = n.low, M = f, w = h, T = m, A = g, x = p, B = b, R = v, K = C, X = S, O = y, N = _, F = I, V = P, q = k, L = D, z = E, H = 0; 80 > H; H++) {
                var U = s[H];
                if (16 > H) var W = U.high = 0 | e[t + 2 * H], G = U.low = 0 | e[t + 2 * H + 1]; else {
                    var W = s[H - 15], G = W.high, J = W.low, W = (G >>> 1 | J << 31) ^ (G >>> 8 | J << 24) ^ G >>> 7,
                        J = (J >>> 1 | G << 31) ^ (J >>> 8 | G << 24) ^ (J >>> 7 | G << 25), j = s[H - 2], G = j.high,
                        Y = j.low, j = (G >>> 19 | Y << 13) ^ (G << 3 | Y >>> 29) ^ G >>> 6,
                        Y = (Y >>> 19 | G << 13) ^ (Y << 3 | G >>> 29) ^ (Y >>> 6 | G << 26), G = s[H - 7], Q = G.high,
                        Z = s[H - 16], $ = Z.high, Z = Z.low, G = J + G.low, W = W + Q + (G >>> 0 < J >>> 0 ? 1 : 0),
                        G = G + Y, W = W + j + (G >>> 0 < Y >>> 0 ? 1 : 0), G = G + Z,
                        W = W + $ + (G >>> 0 < Z >>> 0 ? 1 : 0);
                    U.high = W, U.low = G
                }
                var Q = X & N ^ ~X & V, Z = O & F ^ ~O & q, U = M & T ^ M & x ^ T & x, ee = w & A ^ w & B ^ A & B,
                    J = (M >>> 28 | w << 4) ^ (M << 30 | w >>> 2) ^ (M << 25 | w >>> 7),
                    j = (w >>> 28 | M << 4) ^ (w << 30 | M >>> 2) ^ (w << 25 | M >>> 7), Y = a[H], te = Y.high,
                    ne = Y.low, Y = z + ((O >>> 14 | X << 18) ^ (O >>> 18 | X << 14) ^ (O << 23 | X >>> 9)),
                    $ = L + ((X >>> 14 | O << 18) ^ (X >>> 18 | O << 14) ^ (X << 23 | O >>> 9)) + (Y >>> 0 < z >>> 0 ? 1 : 0),
                    Y = Y + Z, $ = $ + Q + (Y >>> 0 < Z >>> 0 ? 1 : 0), Y = Y + ne,
                    $ = $ + te + (Y >>> 0 < ne >>> 0 ? 1 : 0), Y = Y + G, $ = $ + W + (Y >>> 0 < G >>> 0 ? 1 : 0),
                    G = j + ee, U = J + U + (G >>> 0 < j >>> 0 ? 1 : 0), L = V, z = q, V = N, q = F, N = X, F = O,
                    O = K + Y | 0, X = R + $ + (O >>> 0 < K >>> 0 ? 1 : 0) | 0, R = x, K = B, x = T, B = A, T = M,
                    A = w, w = Y + G | 0, M = $ + U + (w >>> 0 < Y >>> 0 ? 1 : 0) | 0
            }
            h = o.low = h + w, o.high = f + M + (h >>> 0 < w >>> 0 ? 1 : 0), g = r.low = g + A, r.high = m + T + (g >>> 0 < A >>> 0 ? 1 : 0), b = i.low = b + B, i.high = p + x + (b >>> 0 < B >>> 0 ? 1 : 0), C = c.low = C + K, c.high = v + R + (C >>> 0 < K >>> 0 ? 1 : 0), y = l.low = y + O, l.high = S + X + (y >>> 0 < O >>> 0 ? 1 : 0), I = u.low = I + F, u.high = _ + N + (I >>> 0 < F >>> 0 ? 1 : 0), k = d.low = k + q, d.high = P + V + (k >>> 0 < q >>> 0 ? 1 : 0), E = n.low = E + z, n.high = D + L + (E >>> 0 < z >>> 0 ? 1 : 0)
        }, _doFinalize: function () {
            var e = this._data, t = e.words, n = 8 * this._nDataBytes, o = 8 * e.sigBytes;
            return t[o >>> 5] |= 128 << 24 - o % 32, t[30 + (o + 128 >>> 10 << 5)] = Math.floor(n / 4294967296), t[31 + (o + 128 >>> 10 << 5)] = n, e.sigBytes = 4 * t.length, this._process(), this._hash.toX32()
        }, clone: function () {
            var e = n.clone.call(this);
            return e._hash = this._hash.clone(), e
        }, blockSize: 32
    }), t.SHA512 = n._createHelper(o), t.HmacSHA512 = n._createHmacHelper(o)
}(), XPMobileSDK.library.SecureString = {
    sharedKey: null, encrypt: function (e) {
        var t = this.generateKey(), n = CryptoJS.lib.WordArray.random(16), o = {iv: n};
        Settings.DefaultEncryptionPadding && CryptoJS.pad[Settings.DefaultEncryptionPadding] && (o.padding = CryptoJS.pad[Settings.DefaultEncryptionPadding]);
        var r = CryptoJS.AES.encrypt(e, CryptoJS.SHA256(t), o);
        return r.iv.toString(CryptoJS.enc.Base64) + ":" + r.ciphertext.toString(CryptoJS.enc.Base64)
    }, decrypt: function (e) {
        var t = "";
        if (e.indexOf(":") > -1) {
            var n = this.generateKey(), o = e.split(":"), r = CryptoJS.enc.Base64.parse(o[0]),
                i = CryptoJS.enc.Base64.parse(o[1]), a = {iv: r};
            Settings.DefaultEncryptionPadding && CryptoJS.pad[Settings.DefaultEncryptionPadding] && (a.padding = CryptoJS.pad[Settings.DefaultEncryptionPadding]);
            var t = CryptoJS.AES.decrypt({ciphertext: i}, CryptoJS.SHA256(n), a);
            t = CryptoJS.enc.Utf8.stringify(t)
        }
        return t
    }, generateKey: function () {
        var e = "";
        return this.sharedKey ? e = this.sharedKey : XPMobileSDK.library.Connection.dh ? e = this.sharedKey = XPMobileSDK.library.Connection.dh.getSharedKey().toUpperCase() : XPMobileSDK.library.CHAP.sharedKey && (e = this.sharedKey = XPMobileSDK.library.CHAP.sharedKey.toUpperCase()), e
    }
}, XPMobileSDK.library.CHAP = {
    challenges: [],
    monitorTime: 1e3,
    sharedKey: "",
    minChallenges: 50,
    initialize: function () {
        XPMobileSDK.library.Connection.addObserver(this)
    },
    start: function () {
        this.challengeInterval || (this.challengeInterval = setInterval(function () {
            XPMobileSDK.library.CHAP.monitor()
        }, this.monitorTime))
    },
    monitor: function () {
        if (XPMobileSDK.library.Connection.connectionId) {
            if (this.challenges.length > 0) for (var e = 0; e < this.challenges.length; e++) this.challenges[e].isValid() || (this.challenges[e].destroy(), this.challenges.splice(e, 1));
            if (this.challenges.length < this.minChallenges) {
                var t = {NumChallenges: this.minChallenges};
                this.challenges.length <= 10 * this.minChallenges / 100 && (t.Reset = "Yes"), XPMobileSDK.requestChallenges(t)
            }
        }
    },
    add: function (e) {
        if ("string" === typeof e) {
            var t = new XPMobileSDK.library.Challenge(e);
            this.challenges.push(t)
        } else if ("object" === typeof e && e.length > 0) for (var n = 0; n < e.length; n++) {
            var t = new XPMobileSDK.library.Challenge(e[n]);
            this.challenges.push(t)
        }
        this.start()
    },
    takeValidChallenge: function () {
        if (!(this.challenges.length > 0)) return console.log("No challenges in the list!"), {
            getValue: function () {
            }, getTime: function () {
            }
        };
        for (var e = 0; e < this.challenges.length; e++) {
            var t = this.challenges.shift();
            if (t.isValid()) return t;
            t.destroy()
        }
    },
    exportAll: function () {
        var e = [];
        return this.challenges.forEach(function (t) {
            var n = t.getValue();
            n && e.push(n)
        }), e
    },
    sort: function (e, t) {
        return t.getTime() - e.getTime()
    },
    calculate: function () {
        var e = this.takeValidChallenge();
        return e ? {
            Challenge: e.getValue(),
            ChalAnswer: CryptoJS.SHA512((e.getValue() + this.sharedKey).toUpperCase()).toString(CryptoJS.enc.Base64),
            timeout: 1e3 * (e.ttl - e.getTime())
        } : {Challenge: void 0, ChalAnswer: void 0, timeout: void 0}
    },
    connectionLostConnection: function () {
        this.destroy()
    },
    connectionDidDisconnect: function () {
        this.destroy()
    },
    connectionRequestSucceeded: function (e, t) {
        "Yes" == XPMobileSDK.library.Connection.CHAPSupported && t && t.parameters && t.parameters.Challenge && XPMobileSDK.library.Connection.connectionId && this.add(t.parameters.Challenge)
    },
    destroy: function () {
        if (this.challengeInterval && (clearInterval(this.challengeInterval), this.challengeInterval = null), this.challenges.length > 0) for (var e = 0; e < this.challenges.length; e++) {
            var t = this.challenges.shift();
            t.destroy()
        }
        this.challenges = [], XPMobileSDK.library.SecureString.sharedKey = null
    }
}, XPMobileSDK.library.Challenge = function (e) {
    var t = this, n = 1, o = null, r = !0;
    this.ttl = 3540;
    !function () {
        o || (o = setInterval(function () {
            i()
        }, 1e3))
    }();
    var i = function () {
        r = !(n >= t.ttl), r ? n++ : t.destroy()
    };
    this.isValid = function () {
        return r
    }, this.getValue = function () {
        return e
    }, this.getTime = function () {
        return n
    }, this.destroy = function () {
        o && (clearInterval(o), o = null), r = !1
    }
}, XPMobileSDK.library.DiffieHellman = function (e) {
    var t = {
            1024: "F488FD584E49DBCD20B49DE49107366B336C380D451D0F7C88B31C7C5B2D8EF6F3C923C043F0A55B188D8EBB558CB85D38D334FD7C175743A31D186CDE33212CB52AFF3CE1B1294018118D7C84A70A72D686C40319C807297ACA950CD9969FABD00A509B0246D3083D66A45D419F9C7CBD894B221926BAABA25EC355E92F78C7",
            2048: "87A8E61DB4B6663CFFBBD19C651959998CEEF608660DD0F25D2CEED4435E3B00E00DF8F1D61957D4FAF7DF4561B2AA3016C3D91134096FAA3BF4296D830E9A7C209E0C6497517ABD5A8A9D306BCF67ED91F9E6725B4758C022E0B1EF4275BF7B6C5BFC11D45F9088B941F54EB1E59BB8BC39A0BF12307F5C4FDB70C581B23F76B63ACAE1CAA6B7902D52526735488A0EF13C6D9A51BFA4AB3AD8347796524D8EF6A167B5A41825D967E144E5140564251CCACB83E6B486F6B3CA3F7971506026C0B857F689962856DED4010ABD0BE621C3A3960A54E710C375F26375D7014103A4B54330C198AF126116D2276E11715F693877FAD7EF09CADB094AE91E1A1597"
        }, n = str2bigInt(t[XPMobileSDKSettings.primeLength], 16, 1), o = str2bigInt("2", 10, 1), r = randBigInt(160, 0),
        a = null, s = function (e) {
            for (var t = [], n = 0; n < e.length; n += 2) t.push(parseInt(e.substring(n, n + 2), 16));
            return t.reverse(), t
        }, c = function (e) {
            return 255 == e.length && (e = "0" + e), e
        };
    this.createPublicKey = function () {
        var e = s(c(bigInt2str(powMod(o, r, n), 16)));
        return e.push(0), Base64.encodeArray(e)
    }, this.setServerPublicKey = function (e) {
        var t = Base64.decodeBinary(e), n = [];
        for (let i = t.length - 1; i >= 0; i--) n.push(t[i]);
        a = CryptoJS.enc.Base64.parse(Base64.encodeArray(n)).toString()
    }, this.getSharedKey = function () {
        var e = s(c(bigInt2str(powMod(str2bigInt(a, 16, 1), r, n), 16)));
        return CryptoJS.enc.Base64.parse(Base64.encodeArray(e)).toString()
    }, this.encodeString = function (e) {
        var t = this.getSharedKey().substring(0, 96), n = CryptoJS.enc.Hex.parse(t.substring(32, 96)),
            o = CryptoJS.enc.Hex.parse(t.substring(0, 32)), r = {iv: o};
        return XPMobileSDKSettings.defaultEncryptionPadding && CryptoJS.pad[XPMobileSDKSettings.defaultEncryptionPadding] && (r.padding = CryptoJS.pad[XPMobileSDKSettings.defaultEncryptionPadding]), CryptoJS.AES.encrypt(e, n, r).ciphertext.toString(CryptoJS.enc.Base64)
    }
}, CryptoJS.pad.Iso10126 = {
    pad: function (e, t) {
        var n = 4 * t, n = n - e.sigBytes % n;
        e.concat(CryptoJS.lib.WordArray.random(n - 1)).concat(CryptoJS.lib.WordArray.create([n << 24], 1))
    }, unpad: function (e) {
        e.sigBytes -= 255 & e.words[e.sigBytes - 1 >>> 2]
    }
}, XPMobileSDK.library.Ajax = new function () {
    this.Request = function (e, t) {
        t = Object.assign({
            method: "POST",
            contentType: "text/xml",
            responseType: "text",
            encoding: "utf-8",
            postBody: null,
            asynchronous: true,
            onLoading: function () {
            },
            onComplete: function () {
            },
            onSuccess: function () {
            },
            onFailure: function () {
            }
        }, t);
        var o = function () {
            if (1 === n.readyState) {
                t.onLoading(n);
            } else if (4 === n.readyState) {
                if(typeof t.postBody === 'string' && t.postBody.search('Upload') > 0){
                    console.log('PushRespond: ', t.postBody, n)
                }
                if (t.onComplete(n), ("" === n.responseType || "text" === n.responseType) && 0 === n.status && "" === n.responseText) {
                    return void t.onFailure(n);
                }
                if(t.responseType != 'text'){
                }
                200 === n.status || 0 === n.status ? t.onSuccess(n) : t.onFailure(n)
            }
        };

        /*var n = new XMLHttpRequest();
        n.onreadystatechange = o;
        n.open(t.method, e, t.asynchronous);
        n.responseType = t.responseType;
        n.setRequestHeader("Content-Type", t.contentType + "; charset=" + t.encoding);
        n.send(t.postBody);
        return n;*/

        let content = t.postBody;//(t.postBody!=null)?t.postBody:[];
        let url = rootReducer.adaptorServerUrl + '/adaptor/connection';
        var n = new XMLHttpRequest();

        n.onreadystatechange = o;
        n.open(t.method, url, t.asynchronous);
        n.responseType = t.responseType;
        n.setRequestHeader("Content-Type", 'application/json; charset=utf-8');
        n.send(JSON.stringify({
            route: e.substring(url.length),
            content: content,
            responseType: t.responseType,
            contentType: t.contentType + "; charset=" + t.encoding,
        }));
        return n;
        /*let content = t.postBody;
        let url = 'http://192.168.1.66:9001/api/connection';
        let xhr = $.ajax({
            url: url,
            type: t.method,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            data: JSON.stringify({
                route: e.substring(url.length),
                content: content,
                responseType: t.responseType,
                contentType: t.contentType + "; charset=" + t.encoding,
            }),
            responseType: t.responseType,
            success: function (response) {
                if (1 === xhr.readyState) {
                    t.onLoading(xhr);
                } else if (4 === xhr.readyState) {
                    if (t.onComplete(xhr), ("" === xhr.responseType || "text" === xhr.responseType) && 0 === xhr.status && "" === xhr.responseText) {
                        return void t.onFailure(xhr);
                    }
                    if(t.responseType !== 'text') {
                        console.log('response: ', response);
                    }
                    200 === xhr.status || 0 === xhr.status ? t.onSuccess(xhr) : t.onFailure(xhr)
                }
            },
            error: function (xhr, status) {
                console.log('error, ', status, xhr);
            }
        })
        return xhr;*/
    }
}(), XPMobileSDK.library.Bytes = new function () {
    var e = function (e, t) {
        return o(e.toString(16), t)
    }, t = function (e, t) {
        return o(e.replace(/[^a-f0-9]/gi, ""), t)
    }, n = function (e, t) {
        for (var n = atob(e.replace(/^.*?,/, "")).slice(-t), o = new Array(t ? t - n.length : 0), r = 0; r < n.length; r++) o.push(n.charCodeAt(r));
        return o
    }, o = function (e, t) {
        e = e.length % 2 ? "0" + e : e;
        var n = e.match(/../g).splice(-t), o = new Array(t ? t - n.length : 0);
        return o.push.apply(o, n), o.forEach(function (e, t) {
            o[t] = parseInt(e || 0, 16)
        }), o
    };
    return {fromInt: e, fromGuid: t, fromBase64: n, fromHex: o}
}();
var NETWORK = {
    MIN_REQUEST_TIME_LOWER_BOUND: 100,
    MIN_REQUEST_TIME_UPPER_BOUND: 1e3,
    MAX_REQUEST_TIME: 1e4,
    MAX_REQUEST_TIME_ON_FAILURE: 4e3,
    REQUEST_TIME_GROW_PER_EMPTY_FRAME: 1.32,
    REQUEST_TIME_GROW_PER_HTTP_ERROR: 10,
    MIN_REQUEST_TIME_GROW: 1.4,
    MIN_REQUEST_TIME_DECREASE: 3e4,
    MIN_REQUEST_TIME_INCREASE: 15e3,
    VIDEO_PROTOCOL_RECOVER_PACE: 13,
    VIDEO_FAILS_MONITOR: 7e3,
    minRequestTime: 10,
    requestTime: 10,
    requestTimeOnFailure: 2e3,
    websocketSendMessage: 1e3
}, CommunicationStability = new function () {
    function e(e) {
        return o && (new Date()).getTime() - o.getTime() > e
    }

    var t = 0, n = 0, o = null;
    setInterval(function () {
        n = Math.max(0, n - 1 - parseInt(n / NETWORK.VIDEO_PROTOCOL_RECOVER_PACE)), NETWORK.requestTime = NETWORK.minRequestTime + n * NETWORK.REQUEST_TIME_GROW_PER_HTTP_ERROR, NETWORK.requestTimeOnFailure = Math.min(NETWORK.MAX_REQUEST_TIME_ON_FAILURE, NETWORK.requestTime * NETWORK.REQUEST_TIME_GROW_PER_HTTP_ERROR)
    }, 1e3), setInterval(function () {
        e(NETWORK.MIN_REQUEST_TIME_DECREASE) && (NETWORK.minRequestTime = Math.max(NETWORK.MIN_REQUEST_TIME_LOWER_BOUND, .9 * NETWORK.minRequestTime))
    }, NETWORK.VIDEO_FAILS_MONITOR), this.addBreakDown = function (e) {
        e.brokenDown || (t++, e.brokenDown = !0)
    }, this.removeBreakDown = function (e) {
        e.brokenDown && (t--, e.brokenDown = !1)
    }, this.addVideoBreakDown = function () {
        n++, o ? e(NETWORK.MIN_REQUEST_TIME_INCREASE) && (NETWORK.minRequestTime = Math.min(NETWORK.MIN_REQUEST_TIME_UPPER_BOUND, NETWORK.minRequestTime * NETWORK.MIN_REQUEST_TIME_GROW), o = new Date()) : o = new Date()
    }, this.isBrokenDown = function () {
        return t > 0
    }
}();
XPMobileSDK.library.ConnectionStates = {
    idle: 1,
    connecting: 2,
    loggingIn: 3,
    working: 4,
    lostConnection: 5
}, XPMobileSDK.library.ConnectionObserverInterface = {
    connectionStateChanged: function () {
    }, connectionDidConnect: function (e) {
    }, connectionFailedToConnect: function (e) {
    }, connectionFailedToConnectWithId: function (e) {
    }, connectionRequiresCode: function (e) {
    }, connectionCodeError: function () {
    }, connectionDidLogIn: function () {
    }, connectionFailedToLogIn: function (e) {
    }, connectionLostConnection: function () {
    }, connectionProcessingDisconnect: function () {
    }, connectionDidDisconnect: function () {
    }, connectionSwitchedToPull: function () {
    }, connectionRequestSucceeded: function (e, t) {
    }, connectionVersionChanged: function () {
    }, connectionReloadConfiguration: function () {
    }, connectionReloadCameraConfiguration: function () {
    }, closeStreamFinished: function () {
    }
}, XPMobileSDK.library.Connection = new function () {
    var e = this;
    this.connectionId = null, this.currentUserName = null, this.serverTimeout = 30, this.state = XPMobileSDK.library.ConnectionStates.idle, this.DSServerStatus = {
        NotAvailable: 0,
        DoNotEnforce: 1,
        EnforceWheneverPossible: 2,
        Enforce: 3
    };
    var t = [], n = [], o = 0, r = 0;
    this.initialize = function (t) {
        (e.storage = t) && (XPMobileSDK.features = e.storage.getItem("features"), e.resizeAvailable = e.storage.getItem("resizeAvailable"), e.webSocketServer = e.storage.getItem("webSocketServer"), e.webSocketBrowser = e.storage.getItem("webSocketBrowser")), e.server = XPMobileSDKSettings.MobileServerURL || window.location.origin, e.dh = new XPMobileSDK.library.DiffieHellman()
    }, this.addObserver = function (e) {
        -1 == n.indexOf(e) && n.push(e)
    }, this.removeObserver = function (e) {
        var t = n.indexOf(e);
        if (t < 0) return void console.log("Error removing observer. Observer does not exist.");
        n.splice(t, 1)
    }, this.cancelRequest = function (e) {
        console.log("Cancelling request: ", e), e.cancel(), Ce(e)
    }, this.Connect = function (t, n, o) {
        return t = t || {}, ye(XPMobileSDK.library.ConnectionStates.connecting), e.sendCommand("Connect", t, {successCallback: n}, a, o)
    };
    var a = function (t) {
        Ce(t);
        var n = t.response;
        if (!n || n.isError) {
            var o = n && n.error;
            _e("connectionFailedToConnect", o), t.options.failCallback && t.options.failCallback(o)
        } else {
            e.connectionId = n.outputParameters.ConnectionId, e.serverTimeout = parseInt(n.outputParameters.Timeout), e.storage && ("boolean" === typeof e.storage.getItem("resizeAvailable") ? e.resizeAvailable = e.storage.getItem("resizeAvailable") : (e.resizeAvailable = !0, e.storage.setItem("resizeAvailable", e.resizeAvailable)), e.webSocketServer = "Yes" == n.outputParameters.WebSocketSupport, e.storage.setItem("webSocketServer", e.webSocketServer), "boolean" === typeof e.storage.getItem("webSocketBrowser") && window.WebSocket ? e.webSocketBrowser = e.storage.getItem("webSocketBrowser") : (e.webSocketBrowser = !!window.WebSocket, e.storage.setItem("webSocketBrowser", e.webSocketBrowser))), n.outputParameters.SecurityEnabled && (e.SecurityEnabled = n.outputParameters.SecurityEnabled), n.outputParameters.PublicKey && (e.PublicKey = n.outputParameters.PublicKey, e.dh && e.dh.setServerPublicKey(n.outputParameters.PublicKey)), n.outputParameters.CHAPSupported && (e.CHAPSupported = n.outputParameters.CHAPSupported, XPMobileSDK.library.CHAP.sharedKey = e.dh && e.dh.getSharedKey()), console.log("Established connection"), Ie();
            var r = n.outputParameters;
            _e("connectionDidConnect", r), t.options.successCallback && t.options.successCallback(r)
        }
    };
    this.connectWithId = function (t, n) {
        e.server = t, e.connectionId = n, console.log("Connecting with Id " + e.connectionId), ye(XPMobileSDK.library.ConnectionStates.connecting), e.sendLiveMessage(), e.connectingViaExternalConnectionID = !0
    }, this.Login = function (t, n, o) {
        return t = t || {}, console.log("Log in with username " + t.Username + " password " + t.Password), ye(XPMobileSDK.library.ConnectionStates.loggingIn), e.sendCommand("LogIn", t, {successCallback: n}, s, o)
    };
    var s = function (t) {
        Ce(t);
        var n = t.response;
        if (!n || n.isError) if (n && n.error.code == XPMobileSDK.library.ConnectionError.SecondStepAuthenticationRequired) {
            var o = n.outputParameters.SecondStepAuthenticationProvider;
            _e("connectionRequiresCode", o), t.options.successCallback && t.options.successCallback(o)
        } else {
            e.connectionId = null, Pe();
            var r = n && n.error;
            _e("connectionFailedToLogIn", r), t.options.failCallback && t.options.failCallback(r)
        } else c(n, t.options.successCallback)
    }, c = function (e, t) {
        var n = XPMobileSDK.features && XPMobileSDK.features.ServerVersion;
        console.log("Logged in"), De(e.outputParameters), ye(XPMobileSDK.library.ConnectionStates.working), _e("connectionDidLogIn"), t && t(), n && n != XPMobileSDK.features.ServerVersion && _e("connectionVersionChanged")
    };
    this.requestCode = function (t, n) {
        var o = {};
        return e.sendCommand("RequestSecondStepAuthenticationPin", o, {successCallback: t}, l, n)
    };
    var l = function (e) {
        ve(e, "Error requesting validation code.", e.options.successCallback)
    };
    this.verifyCode = function (t) {
        var n = {SecondStepAuthenticationPin: t};
        return e.sendCommand("VerifySecondStepAuthenticationPin", n, null, u)
    };
    var u = function (t) {
        Ce(t);
        var n = t.response;
        !n || n.isError ? n && n.error.code == XPMobileSDK.library.ConnectionError.SecondStepAuthenticationCodeError ? _e("connectionCodeError") : (e.connectionId = null, Pe(), _e("connectionFailedToLogIn", n && n.error)) : c(n)
    };
    this.Disconnect = function (t, n, o) {
        Pe(), ye(XPMobileSDK.library.ConnectionStates.idle), XPMobileSDK.library.VideoConnectionPool.clear();
        var t = t || {}, r = e.sendCommand("Disconnect", t, {successCallback: n}, d, o);
        return _e("connectionProcessingDisconnect"), e.connectionId = null, r
    };
    var d = function (t) {
        Ce(t), _e("connectionDidDisconnect"), e.destroy()
    };
    this.getViews = function (t, n, o) {
        return e.sendCommand("GetViews", {ViewId: t}, {successCallback: n, ViewId: t}, f, o)
    };
    var f = function (e) {
        ve(e, null, function () {
            for (var t = [], n = e.response.subItems.getElementsByTagName("Item"), o = 0, r = n.length; o < r; o++) {
                for (var i = n[o], a = {}, s = 0; s < i.attributes.length; s++) a[i.attributes[s].name] = i.attributes[s].value;
                t.push(a)
            }
            var c = {id: e.options.ViewId, subViews: t};
            e.options.successCallback && e.options.successCallback(c)
        })
    };
    this.getAllViews = function (t, n) {
        return e.sendCommand("GetAllViewsAndCameras", {}, {successCallback: t}, h, n)
    };
    var h = function (e) {
        ve(e, "Error executing GetAllViewsAndCameras on the server.", function () {
            e.options.successCallback && e.options.successCallback(e.response.items)
        })
    };
    this.requestFootageStream = function (t, n, o, r) {
        var i = {FileName: t, FileSize: n, ByteOrder: "Network"};
        return e.sendCommand("RequestFootageStream", i, {successCallback: o}, m, r)
    };
    var m = function (e) {
        ve(e, "Error requesting import footage stream from the server.", function () {
            e.options.successCallback && e.options.successCallback(e.response.outputParameters)
        })
    };
    this.getOsmServerAddresses = function (t, n) {
        return e.sendCommand("GetOsmServerAddresses", {}, {successCallback: t}, g, n)
    };
    var g = function (e) {
        ve(e, "Error getting OSM server addresses from the server.", function () {
            e.options.successCallback && e.options.successCallback(e.response.items)
        })
    };
    this.getGisMapCameras = function (t, n) {
        return e.sendCommand("GetGisMapCameras", {}, {successCallback: t}, p, n)
    };
    var p = function (e) {
        ve(e, "Error getting GIS map cameras from the server.", function () {
            e.options.successCallback && e.options.successCallback(e.response.items)
        })
    };
    this.getGisMapLocations = function (t, n) {
        return e.sendCommand("GetGisMapLocations", {}, {successCallback: t}, b, n)
    };
    var b = function (e) {
        ve(e, "Error getting GIS map cameras from the server.", function () {
            e.options.successCallback && e.options.successCallback(e.response.items)
        })
    };
    this.requestPushStream = function (t, n) {
        console.log('requesting Push stream')
        var o = {SignalType: "Upload", ByteOrder: "Network"};
        return e.RequestStream(o, t, n)
    };
    this.requestStream = function (t, n, o, r, i) {
        var o = o || {};
        if (o.reuseConnection) {
            if (XPMobileSDK.library.VideoConnectionPool.containsCameraVideoConnection(t)) return XPMobileSDK.library.VideoConnectionPool.pretendToOpenStream(t, r);
            XPMobileSDK.library.VideoConnectionPool.addCameraId(t)
        }
        var a = {
            CameraId: t,
            DestWidth: n?Math.round(n.width):1200,
            DestHeight: n?Math.round(n.height):800,
            SignalType: o.signal === XPMobileSDK.interfaces.VideoConnectionSignal.playback ? "Playback" : "Live",
            MethodType: e.webSocketServer && e.webSocketBrowser ? "Push" : "Pull",
            Fps: 15,
            ComprLevel: o.jpegCompressionLevel ? o.jpegCompressionLevel : 70,
            KeyFramesOnly: o.keyFramesOnly ? "Yes" : "No",
            RequestSize: "Yes",
            StreamType: o.streamType == XPMobileSDK.library.VideoConnectionStream.native ? "Native" : o.streamType == XPMobileSDK.library.VideoConnectionStream.segmented ? "Segmented" : "Transcoded"
        };
        console.log('timeStamp: ',o.time, new Date(o.time))
        o.time && (a.SeekType = "Time", a.Time = o.time), o.motionOverlay && (a.MotionOverlay = "Yes"), XPMobileSDK.features.SupportNoScaledImages && (a.ResizeAvailable = "Yes"), XPMobileSDK.features.MultiCameraPlayback && o.playbackControllerId && (a.PlaybackControllerId = o.playbackControllerId);
        var o = {
            successCallback: r,
            cameraId: t,
            signal: o.signal === XPMobileSDK.interfaces.VideoConnectionSignal.playback ? "Playback" : "Live",
            reuseConnection: !!o.reuseConnection
        };
        return e.sendCommand("RequestStream", a, o, v, i)
    }, this.RequestStream = function (t, n, o) {
        return e.sendCommand("RequestStream", t, {successCallback: n}, v, o)
    };
    var v = function (e) {
        ve(e, "Error starting stream for camera " + e.options.cameraId, function () {
            var t = e.response.outputParameters.VideoId;
            console.log("Server prepared video ID " + t + " for camera " + e.options.cameraId);
            var n = new XPMobileSDK.library.VideoConnection(t, e, {onClose: C, onRestart: S, onPushFailed: I});
            e.options.reuseConnection && XPMobileSDK.library.VideoConnectionPool.addVideoConnection(e.options.cameraId, n, e.response), e.options.successCallback && e.options.successCallback(n)
        })
    }, C = function (t) {
        e.closeStream(t.videoId), t.isReusable && XPMobileSDK.library.VideoConnectionPool.removeCamera(t.cameraId)
    }, S = function (t) {
        t.request.parameters.MethodType = e.webSocketServer && e.webSocketBrowser ? "Push" : "Pull", e.closeStream(t.videoId), e.sendCommand("RequestStream", t.request.parameters, t.request.options, v)
    };
    this.RequestAudioStream = function (t, n, o) {
        return e.sendCommand("RequestAudioStream", t, {successCallback: n}, y, o)
    }, this.requestAudioStream = function (t, n, o, r) {
        var n = n || {}, i = {
            ItemId: t,
            MethodType: "Push",
            SignalType: n.signal === XPMobileSDK.interfaces.VideoConnectionSignal.playback ? "Playback" : "Live",
            StreamType: "Transcoded",
            StreamDataType: "Audio",
            AudioEncoding: "Mp3",
            CloseConnectionOnError: "Yes"
        };
        n.playbackControllerId && (i.PlaybackControllerId = n.playbackControllerId), n.AudioCompressionLevel ? i.ComprLevel = n.AudioCompressionLevel : XPMobileSDKSettings.AudioCompressionLevel && (i.ComprLevel = XPMobileSDKSettings.AudioCompressionLevel);
        var n = {successCallback: o, microphoneId: t};
        return e.sendCommand("RequestAudioStream", i, n, y, r)
    };
    var y = function (e) {
            ve(e, "Error starting stream for microphone " + e.options.microphoneId, function () {
                var t = e.response.outputParameters.StreamId;
                console.log("Server prepared stream ID " + t + " for microphone " + e.options.microphoneId), e.options.successCallback && e.options.successCallback(e)
            })
        }
    ;this.toggleWebSocket = function (t) {
        e.webSocketBrowser = !!t, e.storage && e.storage.setItem("webSocketBrowser", e.webSocketBrowser), _()
    };
    var _ = function () {
        XPMobileSDK.library.VideoConnection.instances.forEach(function (e) {
            e.getState() == XPMobileSDK.library.VideoConnectionState.running && e.restart()
        })
    }, I = function () {
        e.toggleWebSocket(!1), _e("connectionSwitchedToPull")
    };
    this.changeStream = function (t, n, o, r, i) {
        var a = {
            VideoConnection: t,
            VideoId: t.videoId,
            DestWidth: Math.round(o.width),
            DestHeight: Math.round(o.height),
            SrcTop: Math.round(n.top),
            SrcLeft: Math.round(n.left)
        };
        return void 0 !== n.right ? a.SrcRight = Math.round(n.right) : void 0 !== n.width && (a.SrcRight = Math.round(n.width) + Math.round(n.left)), void 0 !== n.bottom ? a.SrcBottom = Math.round(n.bottom) : void 0 !== n.height && (a.SrcBottom = Math.round(n.height) + Math.round(n.top)), e.ChangeStream(a, r, i)
    }, this.ChangeStream = function (t, n, o) {
        return e.sendCommand("ChangeStream", t, {successCallback: n}, P, o)
    };
    var P = function (e) {
        ve(e, "Error changing stream.", function () {
            XPMobileSDK.features.SupportTimeBetweenFrames && e.VideoConnection.resetCommunication(), e.options.successCallback && e.options.successCallback()
        })
    };
    this.motionDetection = function (t, n) {
        var o = {VideoId: t.videoId, VideoConnection: t}, r = n.motion || n.MotionAmount;
        r && (o.MotionAmount = Math.round(r));
        var i = n.sensitivity || n.SensitivityAmount;
        i && (o.SensitivityAmount = Math.round(i));
        var a = n.cpu || n.CPUImpactAmount;
        a && (o.CPUImpactAmount = Math.round(a));
        var s = n.grid || n.RegionGrid;
        return /^\d+x\d+(;\d+)+$/.test(s) && (o.RegionGrid = s), e.ChangeStream(o)
    }, this.getPtzPresets = function (t, n, o) {
        var r = {CameraId: t};
        return e.sendCommand("GetPtzPresets", r, {successCallback: n}, k, o)
    };
    var k = function (e) {
        ve(e, "Error getting PTZ presets.", function () {
            delete e.response.outputParameters.Challenge, e.options.successCallback && e.options.successCallback(e.response.outputParameters)
        })
    };
    this.closeStream = function (t) {
        return e.CloseStream({VideoId: t})
    }, this.closeAudioStream = function (t) {
        return e.sendCommand("CloseStream", {VideoId: t}, {successCallback: null}, E)
    }, this.CloseStream = function (t, n, o) {
        return e.sendCommand("CloseStream", t, {successCallback: n}, D, o)
    };
    var D = function (e) {
        M(e), _e("closeStreamFinished")
    }, E = function (e) {
        M(e)
    }, M = function (e) {
        Ce(e);
        var t = e.response;
        t && !t.isError || Me(e) && we()
    }, w = new function () {
        var t = !1, n = !1, o = 15, r = 1, i = 0;
        this.manage = function (e) {
            e ? (i = 0, e > 1 && this.decrease()) : ++i > 5 && (this.increase(), i = 0)
        }.bind(this), this.decrease = function () {
            t || 1 == o || (t = !0, o = o > r ? r : 1, console.log("Decreasing FPS to " + o), a(o, function () {
                t = !1
            }))
        }, this.increase = function () {
            n || 15 == o || (n = !0, r = o++, console.log("Increasing FPS to " + o), a(o, function () {
                n = !1
            }))
        };
        var a = function (t, n, o) {
            for (var r, i = 0; r = XPMobileSDK.library.VideoConnectionPool.cameras[i]; i++) if (r.videoConnection && r.videoConnection.videoId) {
                var a = {VideoId: r.videoConnection.videoId, Fps: t, VideoConnection: r.videoConnection};
                e.ChangeStream(a, n, o)
            }
        }
    }();
    this.ptzPreset = function (t, n) {
        var o = {CameraId: t.cameraId, PtzPreset: n};
        return e.sendCommand("ControlPTZ", o, null, A)
    }, this.ptzMove = function (t, n) {
        var o = {CameraId: t.cameraId, PtzMove: n, VideoConnection: t};
        return e.sendCommand("ControlPTZ", o, null, A)
    }, this.ptzTapAndHold = function (t, n, o) {
        return t.Type = "TapAndHold", t.GestureTimeout = 2e3, e.sendCommand("ControlPTZ", t, {successCallback: n}, T, o)
    };
    var T = function (e) {
        ve(e, "Error controlling PTZ", function () {
            e.options.successCallback && e.options.successCallback()
        })
    };
    this.ptzSwipe = function (t, n) {
        return t.Type = "Swipe", t.GestureDuration = n, e.sendCommand("ControlPTZ", t, null, A)
    };
    var A = function (e) {
        ve(e, "Error controlling PTZ")
    };
    this.playbackSpeed = function (t, n) {
        var o = {VideoId: t.videoId, Speed: n, VideoConnection: t};
        return e.ChangeStream(o)
    }, this.playbackSeek = function (t, n) {
        var o = {VideoId: t.videoId, SeekType: n, VideoConnection: t};
        return e.ChangeStream(o)
    }, this.playbackGoTo = function (t, n, o, r, i) {
        var a = {VideoId: t.videoId, SeekType: o || "Time", Time: n, VideoConnection: t};
        return e.ChangeStream(a, r, i)
    }, this.getThumbnail = function (t, n, o) {
        var r = {CameraId: t, ComprLevel: 70};
        return e.sendCommand("GetThumbnail", r, {successCallback: n}, x, o)
    };
    var x = function (e) {
        ve(e, "Error getting thumbnail.", function () {
            if (e.response.thumbnailBase64) e.options.successCallback && e.options.successCallback(e.response.thumbnailBase64); else if (e.response.thumbnailJSON) {
                var t = document.createElement("video"), n = document.createElement("canvas"), o = n.getContext("2d"),
// eslint-disable-next-line no-undef
                    r = new Segment(e.response.thumbnailJSON);
                t.oncanplaythrough = function () {
                    t.oncanplaythrough = function () {
                    }, t.ontimeupdate = function () {
                        o.canvas.width = t.videoWidth, o.canvas.height = t.videoHeight, o.drawImage(t, 0, 0, t.videoWidth, t.videoHeight), t.src = "", e.options.successCallback && e.options.successCallback(n.toDataURL())
                    }, t.currentTime = r.offset
                }, t.src = r.url
            }
        })
    };
    this.getThumbnailByTime = function (t, n, o, r) {
        var i = {CameraId: t, Time: n, SeekType: "Time"};
        return e.sendCommand("GetThumbnailByTime", i, {successCallback: o}, B, r)
    };
    var B = function (e) {
        ve(e, "Error getting thumbnail by time", function () {
            e.options.successCallback && e.options.successCallback(e.response.outputParameters.Thumbnail)
        })
    };
    this.getDBStartTime = function (t, n, o) {
        var r = {CameraId: t, SeekType: "DbStart"};
        return e.sendCommand("GetRecordingTime", r, {successCallback: n}, R, o)
    };
    var R = function (e) {
        ve(e, "Error getting recording time", function () {
            e.options.successCallback && e.options.successCallback(e.response.outputParameters.Time)
        })
    };
    this.getNextSequence = function (t, n, o, r) {
        var i = parseInt(((new Date()).getTime() - n) / 1e3);
        i = i < 0 ? 0 : i;
        var a = {CameraId: t, SeqType: "Recording", Time: n, AfterTime: i, AfterCount: 1};
        return e.sendCommand("GetSequences", a, {successCallback: o}, K, r)
    };
    var K = function (e) {
        ve(e, "Error getting sequences", function () {
            e.response.sequences.length > 0 ? e.options.successCallback && e.options.successCallback(e.response.sequences[0]) : e.options.successCallback && e.options.successCallback(null)
        })
    };
    this.getPrevSequence = function (t, n, o, r) {
        var i = {CameraId: t, SeqType: "Recording", Time: n, BeforeTime: Date.daysToSeconds(30), BeforeCount: 1};
        return e.sendCommand("GetSequences", i, {successCallback: o}, X, r)
    };
    var X = function (e) {
        ve(e, "Error getting sequences", function () {
            e.response.sequences.length > 0 ? e.options.successCallback && e.options.successCallback(e.response.sequences[0]) : e.options.successCallback && e.options.successCallback(null)
        })
    };
    this.getSequencesInInterval = function (t, n, o, r, i) {
        var a = {CameraId: t, SeqType: "Recording", Time: n, AfterTime: parseInt((o - n) / 1e3), AfterCount: 1e4};
        return e.sendCommand("GetSequences", a, {successCallback: r}, O, i)
    };
    var O = function (e) {
        ve(e, "Error getting sequences", function () {
            e.options.successCallback && e.options.successCallback(e.response.sequences)
        })
    };
    this.startVideoExport = function (t, n, o, r, i) {
        var a = {CameraId: t, StartTime: n, EndTime: o, Type: "Avi"};
        return e.sendCommand("StartExport", a, {successCallback: r}, N, i)
    }, this.startImageExport = function (t, n, o, r) {
        var i = {CameraId: t, StartTime: n, Type: "Jpeg"};
        return e.sendCommand("StartExport", i, {successCallback: o}, N, r)
    }, this.restartErroneousExport = function (t, n, o) {
        var r = {ExportId: t};
        return e.sendCommand("StartExport", r, {successCallback: n}, N, o)
    };
    var N = function (e) {
        ve(e, "Error starting export.", function () {
            e.options.successCallback && e.options.successCallback(e.response.outputParameters.ExportId)
        })
    };
    this.getUserExports = function (t, n) {
        var o = {ExportId: "00000000-0000-0000-0000-000000000000"};
        return e.sendCommand("GetExport", o, {successCallback: t}, F, n)
    };
    var F = function (e) {
        ve(e, "Error getting user exports", function () {
            e.options.successCallback && e.options.successCallback(e.response.exports)
        })
    };
    this.getAllExports = function (t, n) {
        var o = {ExportId: "{A3B9C5FB-FAAD-42C8-AB73-B79D6FFFDBC1}"};
        return e.sendCommand("GetExport", o, {successCallback: t}, V, n)
    };
    var V = function (e) {
        ve(e, "Error getting all exports", function () {
            e.options.successCallback && e.options.successCallback(e.response.exports)
        })
    };
    this.getExport = function (t, n, o) {
        var r = {ExportId: t};
        return e.sendCommand("GetExport", r, {successCallback: n}, q, o)
    };
    var q = function (e) {
        ve(e, "Error getting export", function () {
            if (0 == e.response.exports.length) return void(e.options.successCallback && e.options.successCallback(null));
            e.options.successCallback && e.options.successCallback(e.response.exports[0])
        })
    };
    this.deleteExport = function (t, n, o) {
        var r = {ExportId: t};
        return e.sendCommand("DeleteExport", r, {successCallback: n}, L, o)
    };
    var L = function (e) {
        ve(e, "Error deleting export.", function () {
            e.options.successCallback && e.options.successCallback()
        })
    };
    this.getOutputsAndEvents = function (t, n) {
        var o = {CameraId: ""};
        return e.sendCommand("GetOutputsAndEvents", o, {successCallback: t}, z, n)
    };
    var z = function (e) {
        ve(e, "Error getting outputs and events", function () {
            e.options.successCallback && e.options.successCallback(e.response.actions)
        })
    };
    this.getServerStatus = function (t, n) {
        return e.sendCommand("GetServerStatus", {}, {successCallback: t}, H, n)
    };
    var H = function (e) {
        ve(e, "Error getting server status", function () {
            e.options.successCallback && e.options.successCallback(e.response.ServerStatus)
        })
    };
    this.triggerOutputOrEvent = function (t, n, o, r) {
        var i = {ObjectId: t, TriggerType: n};
        return e.sendCommand("RequestActivation", i, {successCallback: o}, U, r)
    };
    var U = function (e) {
        ve(e, "Error triggering output or event.", function () {
            e.options.successCallback && e.options.successCallback()
        })
    };
    this.getCameraCapabilities = function (t, n, o) {
        var r = {CameraId: t};
        return e.sendCommand("GetCapabilities", r, {successCallback: n}, W, o)
    };
    var W = function (e) {
        ve(e, "Error getting camera capabilities", function () {
            e.options.successCallback && e.options.successCallback(e.response.outputParameters)
        })
    };
    this.prepareUpload = function (t, n, o) {
        return e.sendCommand("PrepareUpload", t, {successCallback: n}, G, o)
    };
    var G = function (e) {
        ve(e, "Error preparing upload", function () {
            e.options.successCallback && e.options.successCallback(e.response.outputParameters)
        })
    };
    this.getUploadStatus = function (t, n, o) {
        return e.sendCommand("GetUploadStatus", t, {successCallback: n}, J, o)
    };
    var J = function (e) {
        ve(e, "Error getting upload status", function () {
            e.options.successCallback && e.options.successCallback(e.response.outputParameters)
        })
    };
    this.requestChallenges = function (t, n, o) {
        return e.sendCommand("RequestChallenges", t, {successCallback: n}, j, o)
    };
    var j = function (e) {
        ve(e, "Error getting challenges.", function () {
            e.options.successCallback && e.options.successCallback(e.response.outputParameters)
        })
    };
    this.createPlaybackController = function (t, n, o) {
        return t.MethodType = e.webSocketServer && e.webSocketBrowser ? "Push" : "Pull", t.CloseOldControllers = "Yes", e.sendCommand("CreatePlaybackController", t, {successCallback: n}, Y, o)
    };
    var Y = function (e) {
        var t = e.response, n = new XPMobileSDK.library.VideoConnection(t.outputParameters.PlaybackControllerId, e, {
            onClose: function () {
            }, onRestart: function () {
            }, onPushFailed: function () {
            }
        });
        ve(e, "Error creating playback controller", function () {
            e.options.successCallback && e.options.successCallback(n)
        })
    };
    this.changeMultipleStreams = function (t, n, o) {
        return e.sendCommand("ChangeMultipleStreams", t, {successCallback: n}, Q, o)
    };
    var Q = function (e) {
        ve(e, "Error getting multiple stream data", function () {
            e.options.successCallback && e.options.successCallback(e.response.outputParameters)
        })
    };
    this.getAllInvestigations = function (t, n) {
        var o = {ItemId: "{A3B9C5FB-FAAD-42C8-AB73-B79D6FFFDBC1}"};
        return e.sendCommand("GetInvestigation", o, {successCallback: t}, Z, n)
    }, this.getUserInvestigations = function (t, n) {
        var o = {ItemId: "00000000-0000-0000-0000-000000000000"};
        return e.sendCommand("GetInvestigation", o, {successCallback: t}, Z, n)
    };
    var Z = function (e) {
        ve(e, "Error getting investigations", function () {
            e.options.successCallback && e.options.successCallback(e.response.items)
        })
    };
    this.getInvestigation = function (t, n, o) {
        var r = {ItemId: t};
        return e.sendCommand("GetInvestigation", r, {successCallback: n}, ee, o)
    };
    var ee = function (e) {
        ve(e, "Error getting investigation", function () {
            e.options.successCallback && e.options.successCallback(e.response.items[0])
        })
    };
    this.createInvestigation = function (t, n, o) {
        return e.sendCommand("CreateInvestigation", t, {successCallback: n}, te, o)
    };
    var te = function (e) {
        ve(e, "Error creating investigation to the server.", function () {
            e.options.successCallback && e.options.successCallback(e.response.outputParameters)
        })
    };
    this.updateInvestigation = function (t, n, o) {
        return e.sendCommand("UpdateInvestigation", t, {successCallback: n}, ne, o)
    }, this.updateInvestigationData = function (t, n, o) {
        return e.sendCommand("UpdateInvestigationData", t, {successCallback: n}, ne, o)
    };
    var ne = function (e) {
        ve(e, "Error updating investigation to the server.", function () {
            e.options.successCallback && e.options.successCallback(e.response.outputParameters)
        })
    };
    this.deleteInvestigation = function (t, n, o) {
        return e.sendCommand("DeleteInvestigation", {ItemId: t}, {successCallback: n}, oe, o)
    };
    var oe = function (e) {
        ve(e, "Error deleteing investigation from the server.", function () {
            e.options.successCallback && e.options.successCallback(!e.response.isError)
        })
    };
    this.cancelInvestigation = function (t) {
        return e.sendCommand("CancelInvestigationUpdate", {ItemId: t}, null, re)
    };
    var re = function (e) {
        ve(e, "Error canceling investigation update")
    };
    this.startInvestigationExport = function (t, n, o, r, i) {
        var a = {InvestigationId: t, ExportType: n, IncludeAudio: o};
        return e.sendCommand("StartInvestigationExport", a, {successCallback: r}, ie, i)
    };
    var ie = function (e) {
        ve(e, "Error starting investigation export.", function () {
            e.options.successCallback && e.options.successCallback(e.response.outputParameters.ExportId)
        })
    };
    this.deleteInvestigationExport = function (t, n, o, r) {
        var i = {InvestigationId: t, ExportType: n};
        return e.sendCommand("DeleteInvestigationExport", i, {successCallback: o}, ae, r)
    };
    var ae = function (e) {
        ve(e, "Error deleting investigation export.", e.options.successCallback)
    };
    this.getAlarmList = function (t, n, o) {
        var t = {
            MyAlarms: t.MyAlarms || "No",
            Timestamp: t.Timestamp,
            Operator: "LessThan",
            Count: t.Count,
            Priority: t.Priority,
            State: t.State
        };
        return e.sendCommand("GetAlarmList", t, {successCallback: n}, se, o)
    };
    var se = function (e) {
        ve(e, "Error getting alarms", function () {
            e.options.successCallback && e.options.successCallback(e.response.items)
        })
    };
    this.getAlarm = function (t, n, o) {
        var r = {AlarmId: t};
        return e.sendCommand("GetAlarmList", r, {successCallback: n}, ce, o)
    };
    var ce = function (e) {
        ve(e, "Error getting alarm", function () {
            e.options.successCallback && e.options.successCallback(e.response.items[0])
        })
    };
    this.updateAlarm = function (t, n, o) {
        return e.sendCommand("UpdateAlarm", t, {successCallback: n}, le, o)
    };
    var le = function (e) {
        ve(e, "Error updating alarms", function () {
            e.options.successCallback && e.options.successCallback()
        })
    };
    this.getAlarmDataSettings = function (t, n) {
        return e.sendCommand("GetAlarmDataSettings", {}, {successCallback: t}, ue, n)
    };
    var ue = function (e) {
        ve(e, "Error getting alarm data settings", function () {
            e.options.successCallback && e.options.successCallback(e.response.items)
        })
    };
    this.getAlarmUsers = function (t, n, o) {
        return e.sendCommand("GetPermittedUsers", {SourceId: t}, {successCallback: n}, de, o)
    };
    var de = function (e) {
        ve(e, "Error getting permitted users for alarm", function () {
            e.options.successCallback && e.options.successCallback(e.response.items)
        })
    };
    this.acknowledgeAlarm = function (t, n, o) {
        return e.sendCommand("AcknowledgeAlarm", {Id: t}, {successCallback: n}, fe, o)
    };
    var fe = function (e) {
        ve(e, "Error acknowledging alarm", function () {
            e.options.successCallback && e.options.successCallback()
        })
    };
    this.prevCarouselCamera = function (t) {
        return e.sendCommand("ControlCarousel", {VideoId: t, CarouselCommand: "PreviousCamera"}, null, he)
    };
    var he = function (e) {
        ve(e, "Error getting prev camera from carousel")
    };
    this.nextCarouselCamera = function (t) {
        return e.sendCommand("ControlCarousel", {VideoId: t, CarouselCommand: "NextCamera"}, null, me)
    };
    var me = function (e) {
        ve(e, "Error getting next camera from carousel")
    };
    this.pauseCarousel = function (t) {
        return e.sendCommand("ControlCarousel", {VideoId: t, CarouselCommand: "PauseCarousel"}, null, ge)
    };
    var ge = function (e) {
        ve(e, "Error pausing carousel")
    };
    this.resumeCarousel = function (t) {
        return e.sendCommand("ControlCarousel", {VideoId: t, CarouselCommand: "ResumeCarousel"}, null, pe)
    };
    var pe = function (e) {
        ve(e, "Error resuming carousel")
    };
    this.registerForNotifications = function (t, n, o) {
        var r = $.getBrowser(), i = r.name + " " + r.version + ", " + r.os, a = {
            Settings: t,
            DeviceName: XPMobileSDK.library.Connection.dh.encodeString(i),
            DeviceId: XPMobileSDK.library.Connection.connectionId
        };
        return e.RegisterForNotifications(a, n, o)
    }, this.RegisterForNotifications = function (t, n, o) {
        return e.sendCommand("RegisterForNotifications", t, {successCallback: n}, be, o)
    };
    var be = function (e) {
        ve(e, "Error register for notifications.", function () {
            e.options.successCallback && e.options.successCallback(e.response.items)
        })
    }, ve = function (e, t, n) {
        Ce(e);
        var o = e.response;
        !o || o.isError ? Me(e) ? (console.log("The application has lost connection due to connectionRequestResponseIsTerminal"), console.log(t), we()) : (console.log(t), e.options.failCallback ? e.options.failCallback(o.error, o) : e.options.successCallback && e.options.successCallback(null, o.error, o)) : n && n()
    };
    this.sendCommand = function (n, o, r, i, a) {
        if (o = o || {}, XPMobileSDKSettings.supportsCHAP && "Yes" == e.SecurityEnabled && "Yes" == e.CHAPSupported) {
            var s = XPMobileSDK.library.CHAP.calculate();
            s.Challenge && s.ChalAnswer && (o.Challenge = s.Challenge, o.ChalAnswer = s.ChalAnswer)
        }
        r = r || {}, a && (r.failCallback = a), console.log("Sending " + n + " on " + new Date() + "with ", o);
        var c = new XPMobileSDK.library.ConnectionRequest(n, Se(), o, r, i);
        return t.push(c), c
    };
    var Ce = function (e) {
        var n = t.indexOf(e);
        n > -1 && t.splice(n, 1);
        var o = {parameters: e.params, options: e.options}, r = e.response && {parameters: e.response.outputParameters};
        _e("connectionRequestSucceeded", o, r)
    }, Se = function () {
        return ++o
    }, ye = function (t) {
        e.state = t, _e("connectionStateChanged")
    }, _e = function () {
        if (!(arguments.length < 1)) {
            var e = arguments[0], t = Array.prototype.slice.call(arguments, 1);
            n.forEach(function (n) {
                if (n[e]) try {
                    n[e].apply(n, t)
                } catch (e) {
                    console.log(e), console.log(e.stack)
                }
            })
        }
    }, Ie = function () {
        e.liveMessageTimer || (e.liveMessageTimer = setInterval(e.sendLiveMessage, 1e3 * e.serverTimeout / 3))
    };
    this.updateLiveMessageTimer = function (t) {
        var n = 1e3 * e.serverTimeout / 3;
        t && "number" === typeof t && (n = Math.min(n, t)), clearTimeout(e.liveMessageTimer), e.liveMessageTimer = setInterval(e.sendLiveMessage, n)
    };
    var Pe = function () {
        e.liveMessageTimer && (clearTimeout(e.liveMessageTimer), e.liveMessageTimer = null)
    };
    this.sendLiveMessage = function () {
        console.log("Live messages waiting: " + r), e.LiveMessage(), e.webSocketServer && e.webSocketBrowser && w.manage(r), r++
    }, this.LiveMessage = function (t, n, o) {
        t = t || {}, e.sendCommand("LiveMessage", t, {successCallback: n}, ke, o)
    };
    var ke = function (t) {
        r--, Ce(t);
        var n = t.response;
        if ((!n || n.isError) && Me(t)) return e.connectingViaExternalConnectionID ? (e.connectingViaExternalConnectionID = !1, console.log("Old connection ID has expired"), _e("connectionFailedToConnectWithId", n && n.error), e.connectionId = null) : we(), void Pe();
        if (e.connectingViaExternalConnectionID && (e.connectingViaExternalConnectionID = !1, console.log("Started connection from external connection ID"), ye(XPMobileSDK.library.ConnectionStates.working), _e("connectionDidLogIn")), "Yes" != n.outputParameters.FolderDefinitionsChanged && "Yes" != n.outputParameters.ViewDefinitionsChanged || _e("connectionReloadConfiguration"), "Yes" == n.outputParameters.CameraDefinitionsChanged && _e("connectionReloadCameraConfiguration"), n.items.length > 0) for (var o = 0; o < n.items.length; o++) "Notification" == n.items[o].Type && _e("receivedNotification", n.items[o]);
        Ie()
    }, De = function (t) {
        if (t) {
            t.SupportNoScaledImages || (t.SupportNoScaledImages = "Yes");
            var n = {};
            for (let i in t) switch (i) {
                case"Challenge":
                    n.CHAPSupported = !0;
                    break;
                case"ServerVersion":
                    n.ServerVersion = t[i];
                    break;
                default:
                    var o = isNaN(Number(t[i])) ? "Yes" == t[i] : Number(t[i]);
                    n[i] = o
            }
            Ee(n), e.storage && e.storage.setItem("features", n), XPMobileSDK.features = n
        }
    }, Ee = function (t) {
        return t.NativeStreamingAvailable ? t.TranscodedStreamingAvailable ? t.NativeStreamingSuggested ? void(t.DirectStreaming = e.DSServerStatus.EnforceWheneverPossible) : void(t.DirectStreaming = e.DSServerStatus.DoNotEnforce) : void(t.DirectStreaming = e.DSServerStatus.Enforce) : void(t.DirectStreaming = e.DSServerStatus.NotAvailable)
    }, Me = function (e) {
        var t = e.response;
        return void 0 == t || t.errorCode == XPMobileSDK.library.ConnectionError.WrongID || t.errorCode == XPMobileSDK.library.ConnectionError.ChallengesLimitReached || "Wrong connection ID" == t.errorString
    }, we = function () {
        e.state != XPMobileSDK.library.ConnectionStates.lostConnection && (ye(XPMobileSDK.library.ConnectionStates.lostConnection), e.connectionId = null, XPMobileSDK.library.VideoConnectionPool.clear(), e.destroy(), _e("connectionLostConnection"))
    };
    this.destroy = function () {
        t = [], e.storage && (e.storage.removeItem("features"), e.storage.removeItem("webSocketServer"))
    }
};
XPMobileSDK.library.ConnectionError = {
    NotImplemented: 1,
    NotFullyImplemented: 2,
    BadCommandType: 10,
    BadCommandKind: 11,
    WrongID: 12,
    MissingInputParameter: 13,
    WrongInputParameter: 14,
    InvalidCredentials: 15,
    IncorrectPublicKey: 16,
    SurveillanceServerDown: 17,
    InvalidLicense: 18,
    SecurityError: 19,
    UnknownCameraID: 20,
    UnknownItemID: 21,
    NoPresetsAvailable: 22,
    NotAllowedInThisState: 23,
    FeatureIsDisabled: 24,
    InsufficientUserRights: 25,
    TooManySessions: 26,
    NewConfigurationNotAvailable: 27,
    AddressesNotReachable: 28,
    PlaybackStreamsLimitReached: 29,
    Redirection: 30,
    MovingInvestigations: 31,
    NoRecordingsFound: 32,
    NoRecordingsInInterval: 33,
    SecondStepAuthenticationRequired: 34,
    SecondStepAuthenticationEnabledUsersOnly: 35,
    SecondStepAuthenticationCodeError: 36,
    SecondStepAuthenticationCodeExpired: 37,
    ImportFootageFileSizeOverLimit: 38,
    ImportFootageFileTypeNotAllowed: 39,
    InputParameterTooLong: 43,
    ChallengesLimitReached: 51,
    CommandTimedOut: 2147483645,
    InternalError: 2147483646,
    Unknown: 2147483647
}, XPMobileSDK.library.ConnectionRequest = function (e, t, n, o, r) {
    function i() {
        d = XPMobileSDK.library.Ajax.Request(p, {
            contentType: "text/xml",
            postBody: g,
            onSuccess: s,
            onComplete: a,
            onFailure: u.options.failCallback || function () {
            }
        })
    }

    function a(e) {
        try {
            4 == e.readyState && 200 != e.status && l()
        } catch (e) {
            l()
        }
    }

    function s() {
        CommunicationStability.removeBreakDown(u), f && (clearTimeout(f), f = null), h || (c(), h = !0), d = null
    }

    function c() {
        var e = 0;
        try {
            var t = d.responseText
        } catch (e) {
            return
        }
        for ("<?xml" != t.trim().substr(0, 5) && (u.response = {
            isError: !0,
            errorCode: "The response from the server is not well-formatted",
            outputParameters: []
        }, r && r(u)); (e = t.indexOf("\r\n\r\n", m)) > 0;) {
            var n = t.substring(m, e);
            if (n) {
                var o = new XPMobileSDK.library.ConnectionResponse(n);
                o.isProcessing || (u.response = o, h = !0, r && r(u))
            }
            m = e + 4
        }
    }

    function l() {
        console.log("Command " + e + " failed"), "LiveMessage" != e && "CloseStream" != e && "RequestStream" != e && "Disconnect" != e || (console.log("Restarting " + e), CommunicationStability.addBreakDown(u), setTimeout(function () {
            h = !1, i()
        }, 1e3))
    }

    var u = this;
    u.options = o || {}, u.response = null, n.VideoConnection && (u.VideoConnection = n.VideoConnection, delete n.VideoConnection), u.params = n || {};
    var d, f, h = !1, m = 0, g = function () {
        var o = "";
        for (let key in n) {
            var r = function (e, t) {
                return t = void 0 !== t && t.toString ? t.toString() : "", t = t.replace('"', '"'), '<Param Name="' + e + '" Value="' + t + '" />'
            };
            void 0 !== n[key] && n[key] instanceof Array ? n[key].forEach(function (e) {
                o += r(key, e)
            }) : o += r(key, n[key])
        }
        return '<?xml version="1.0" encoding="utf-8"?><Communication xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">' + (XPMobileSDK.library.Connection.connectionId ? "<ConnectionId>" + XPMobileSDK.library.Connection.connectionId + "</ConnectionId >" : "") + '<Command SequenceId="' + t + '"><Type>Request</Type><Name>' + e + "</Name><InputParams>" + o + "</InputParams></Command></Communication>\r\n\r\n"
    }(), p = function (e) {
        return /^http(s)?:/i.test(e) ? e : window.location.protocol + "//" + document.location.hostname + (document.location.port && !/^:\d+/.test(e) ? ":" + document.location.port : "") + e
    }(XPMobileSDK.library.Connection.server) + XPMobileSDKSettings.communicationChanel;
    i(), this.cancel = function () {
        f && (clearTimeout(f), f = null), d && (d.onreadystatechange = function () {
        }, d.abort(), d = null, XPMobileSDK.library.Ajax.activeRequestCount--), "RequestStream" == e && u.options.reuseConnection && XPMobileSDK.library.VideoConnectionPool.removeCamera(u.params.CameraId)
    }
}, XPMobileSDK.library.ConnectionResponse = function (e) {
    function t(e, t) {
        for (var o = {}, r = 0; r < e.attributes.length; r++) {
            var i = e.attributes[r];
            t && t.numbers && -1 != t.numbers.indexOf(i.name) ? o[i.name] = parseInt(i.value) : t && t.dates && -1 != t.dates.indexOf(i.name) ? o[i.name] = new Date(parseInt(i.value)) : o[i.name] = n(i.value)
        }
        return o
    }

    function n(e) {
        for (var t = ["<", ">"], n = 0, o = t.length; n < o; ++n) e = e.replace(new RegExp(t[n], "g"), "");
        return e
    }

    var o = this;
    o.sequenceID = 0, o.command = "", o.isResponse = !1, o.isProcessing = !1, o.isError = !1, o.outputParameters = null, o.subItems = null, o.thumbnailBase64 = null, o.exports = [], o.sequences = [], o.actions = [], o.items = [], o.errorCode = 0, o.errorString = "";
    var r = parseXML(e), i = r.getElementsByTagName("Communication")[0], a = i.getElementsByTagName("Command")[0],
        s = a.getElementsByTagName("Type")[0];
    if ("Processing" == XMLNodeTextContent(s)) console.log("Processing..."), o.isProcessing = !0; else if ("Response" == XMLNodeTextContent(s)) {
        o.isResponse = !0;
        var c;
        if (c = a.getElementsByTagName("OutputParams"), c.length > 0) {
            o.outputParameters = {};
            for (var l = c[0], u = l.getElementsByTagName("Param"), d = 0, f = u.length; d < f; d++) {
                for (var h = u[d], m = "", g = "", p = h.attributes, b = 0; b < p.length; b++) {
                    var v = p[b];
                    "Name" == v.name ? m = v.value : "Value" == v.name && (g = v.value)
                }
                if (m && g) if (this.outputParameters[m] && "string" === typeof this.outputParameters[m]) {
                    var C = this.outputParameters[m];
                    this.outputParameters[m] = new Array(), this.outputParameters[m].push(C)
                } else "object" === typeof this.outputParameters[m] ? this.outputParameters[m].push(g) : this.outputParameters[m] = g
            }
        }
        if (c = a.getElementsByTagName("SubItems"), c.length > 0 && (o.subItems = c[0]), c = a.getElementsByTagName("ServerStatus"), c.length > 0) {
            o.ServerStatus = {};
            var S = c[0].getElementsByTagName("CpuUsage");
            S.length > 0 && (o.ServerStatus.CPU = XMLNodeTextContent(S[0]));
            var y = c[0].getElementsByTagName("DiskUsage");
            if (y.length > 0) {
                o.ServerStatus.HDD = {};
                var _ = y[0].getElementsByTagName("RecordingDiskUsageInBytes");
                _.length > 0 && (o.ServerStatus.HDD.recorded = XMLNodeTextContent(_[0]));
                var I = y[0].getElementsByTagName("ExportsDiskUsageInBytes");
                I.length > 0 && (o.ServerStatus.HDD.exports = XMLNodeTextContent(I[0]));
                var P = y[0].getElementsByTagName("UserDiskUsageInBytes");
                P.length > 0 && (o.ServerStatus.HDD.user = XMLNodeTextContent(P[0]));
                var k = y[0].getElementsByTagName("OtherDiskUsageInBytes");
                k.length > 0 && (o.ServerStatus.HDD.other = XMLNodeTextContent(k[0]));
                var D = y[0].getElementsByTagName("FreeSpaceInBytes");
                D.length > 0 && (o.ServerStatus.HDD.free = XMLNodeTextContent(D[0]))
            }
        }
        !function (e) {
            var t = e.getElementsByTagName("Thumbnail")[0];
            if (t) return void(o.thumbnailBase64 = "data:image/jpeg;base64," + XMLNodeTextContent(t));
            var n = e.getElementsByTagName("ThumbnailJSON")[0];
            n && (o.thumbnailJSON = XMLNodeTextContent(n))
        }(a), function (e) {
            var n = e.getElementsByTagName("Exports");
            if (n.length > 0) {
                o.exports = [];
                for (var r = n[0].getElementsByTagName("Export"), i = 0; i < r.length; i++) {
                    var a = t(r[i], {
                        numbers: ["Size", "State"],
                        dates: ["StartTime", "EndTime", "CompletedTime", "QueuedTime"]
                    });
                    o.exports.push(a)
                }
            }
        }(a), function (e) {
            var n = e.getElementsByTagName("Sequences");
            if (n.length > 0) {
                o.sequences = [];
                for (var r = n[0].getElementsByTagName("Sequence"), i = 0; i < r.length; i++) {
                    var a = t(r[i], {dates: ["StartTime", "EndTime"]});
                    o.sequences.push(a)
                }
            }
        }(a), function (e) {
            var n = "00000000-0000-0000-0000-000000000000";
            o.actions = [];
            var r = e.getElementsByTagName("OEHeaderGroup");
            0 != r.length && (Array.prototype.forEach.call(r, function (e) {
                var n = e.getElementsByTagName("OEItem");
                Array.prototype.forEach.call(n, function (n) {
                    var r = t(n);
                    r.Type = e.getAttribute("Name"), o.actions.push(r)
                })
            }), o.actions.sort(function (e, t) {
                return "Outputs" == e.Type && "Events" == t.Type ? -1 : "Events" == e.Type && "Outputs" == t.Type ? 1 : e.CameraId != n && t.CameraId == n ? -1 : e.CameraId == n && t.CameraId != n ? 1 : e.Name < t.Name ? -1 : e.Name > t.Name ? 1 : 0
            }))
        }(a), function (e) {
            var t = function (e) {
                for (var o = [], r = e.childNodes, i = 0; i < r.length; i++) if ("Item" == r[i].nodeName) {
                    var a = {};
                    if (r[i].attributes.length > 0) for (var s = 0; s < r[i].attributes.length; s++) a[r[i].attributes[s].name] = n(r[i].attributes[s].value);
                    for (var s = 0; s < r[i].childNodes.length; s++) if ("Properties" == r[i].childNodes[s].nodeName) for (var c = 0; c < r[i].childNodes[s].attributes.length; c++) a[r[i].childNodes[s].attributes[c].name] = n(r[i].childNodes[s].attributes[c].value); else "Items" == r[i].childNodes[s].nodeName && (a.Items = t(r[i].childNodes[s]));
                    o.push(a)
                }
                return o
            };
            !function (e) {
                for (var n = e.childNodes, r = null, i = 0; i < n.length; i++) "Items" == n[i].nodeName && (r = n[i]);
                r && (o.items = t(r))
            }(e)
        }(a);
        var E = a.getElementsByTagName("Result")[0];
        "OK" != XMLNodeTextContent(E) && (o.isError = !0, c = a.getElementsByTagName("ErrorString"), c.length > 0 && (o.errorString = XMLNodeTextContent(c[0])), c = a.getElementsByTagName("ErrorCode"), c.length > 0 && (o.errorCode = parseInt(XMLNodeTextContent(c[0]))), o.error = {
            code: o.errorCode || XPMobileSDK.library.ConnectionError.Unknown,
            message: o.errorString || ""
        }, console.log("Response error " + (o.errorString || function (e) {
            var t;
            return Object.keys(XPMobileSDK.library.ConnectionError).forEach(function (n) {
                XPMobileSDK.library.ConnectionError[n] == e && (t = n)
            }), t
        }(o.errorCode)) + " " + (o.errorCode || "") + " Complete response: " + e))
    }
};
var parseXML, XMLNodeTextContent;
if (void 0 !== window.DOMParser) parseXML = function (e) {
    return (new window.DOMParser()).parseFromString(e, "text/xml")
}, XMLNodeTextContent = function (e) {
    return e.textContent
}; else {
    if (void 0 === window.ActiveXObject || !new window.ActiveXObject("Microsoft.XMLDOM")) throw new Error("No XML parser found");
    parseXML = function (e) {
        var t = new window.ActiveXObject("Microsoft.XMLDOM");
        return t.async = "false", t.loadXML(e), t
    }, XMLNodeTextContent = function (e) {
        return e.text
    }
}
XPMobileSDK.library.PullConnectionObserverInterface = {
    onError: function (e) {
    }, onHTTPError: function (e) {
    }, onPushFailed: function () {
    }, notifyChannel: function (e) {
    }, notifyObservers: function (e) {
    }, videoConnectionTemporaryDown: function (e) {
    }, restart: function () {
    }
}, XPMobileSDK.library.PullConnection = function (e, t) {
    function n(e) {
        c() && r(e) && s() && o(e)
    }

    function o(t) {
        C.nextFrameTimeout = setTimeout(function () {
            f(), C.videoConnectionState != XPMobileSDK.library.VideoConnectionState.closed && (C.ajaxRequest = new XPMobileSDK.library.Ajax.Request(e, b))
        }, t || 1)
    }

    function r(e) {
        return !CommunicationStability.isBrokenDown() || (setTimeout(function () {
            n(e)
        }, 200), !1)
    }

    function i() {
        return C.videoConnectionState != XPMobileSDK.library.VideoConnectionState.closed
    }

    function a() {
        return !C.ajaxRequest
    }

    function s() {
        return !C.nextFrameTimeout
    }

    function c() {
        return a() || i() || s()
    }

    function l(e) {
        if (a()) {
            h();
            var t = XPMobileSDKSettings.videoConnectionTimeout;
            C.ajaxRequestTimeout = setTimeout(function () {
                e && (console.log("aborting video request for " + C.videoId), e.onreadystatechange = function () {
                }, e.abort(), XPMobileSDK.library.Ajax.activeRequestCount--, p("onError", e))
            }, t)
        }
    }

    function u(e) {
        if (0 == e.status && (!e.response || 0 === e.response.byteLength)) return void p("onHTTPError", e);
        if (i()) {
            p("notifyChannel", !0), h();
            try {
                var t = e.response, o = new XPMobileSDK.library.VideoItem(t);
                if (o.duration) var r = 1e3 * o.duration * .8;
                p("notifyObservers", o), h(), C.videoConnectionState == XPMobileSDK.library.VideoConnectionState.running && (o.stream && o.stream.timeBetweenFrames ? (y = o.stream.timeBetweenFrames, C.requestNextFrameInterval = y) : y ? C.requestNextFrameInterval = y : o.dataSize || C.signalType != XPMobileSDK.interfaces.VideoConnectionSignal.live ? C.requestNextFrameInterval = r || NETWORK.requestTime : C.requestNextFrameInterval = Math.min(NETWORK.MAX_REQUEST_TIME, C.requestNextFrameInterval * g(100 * NETWORK.REQUEST_TIME_GROW_PER_EMPTY_FRAME) / 100), n(C.requestNextFrameInterval)), v = o
            } catch (t) {
                console.log("Exception in video connection ajax response"), console.log(t), console.log(t.stack), p("onHTTPError", e)
            }
        }
    }

    function d(t) {
        console.log("ERROR in ajax request for frame for video channel " + e), p("onHTTPError", t)
    }

    function f() {
        C.nextFrameTimeout && (clearTimeout(C.nextFrameTimeout), C.nextFrameTimeout = null)
    }

    function h() {
        C.ajaxRequestTimeout && (clearTimeout(C.ajaxRequestTimeout), C.ajaxRequestTimeout = null)
    }

    function m() {
        C.ajaxRequest && (4 == C.ajaxRequest.readyState && 200 == C.ajaxRequest.status || C.ajaxRequest.abort(), delete C.ajaxRequest, C.ajaxRequest = null)
    }

    function g(e) {
        var t = e - 10, n = e + 10;
        return Math.floor(Math.random() * (n - t + 1)) + t
    }

    function p(e, t) {
        S.forEach(function (n) {
            n && n[e] && n[e](t)
        })
    }

    var b = {method: "post", contentType: "text/xml", onLoading: l, onSuccess: u, onFailure: d}, v = null;
    t.signalType, t.isSegmented;
    "undefined" !== typeof ArrayBuffer && (b.responseType = "arraybuffer");
    var C = this;
    C.videoConnectionState = XPMobileSDK.library.VideoConnectionState.running;
    var S = [], y = 0;
    this.restartConnection = function (e) {
        try {
            if (e ? p("videoConnectionTemporaryDown", e.status) : p("videoConnectionTemporaryDown", -2), C.videoConnectionState == XPMobileSDK.library.VideoConnectionState.closed) return;
            p("restart")
        } catch (e) {
            p("videoConnectionTemporaryDown", -1)
        }
    }, this.cleanupCommunication = function () {
        f(), h(), m(), y = 0
    }, this.startCommunication = function (e) {
        this.cleanupCommunication(), n(e)
    }, this.videoConnectionChangedState = function (e) {
        C.videoConnectionState = e
    }, this.addObserver = function (e) {
        S.push(e)
    }, this.removeObserver = function (e) {
        var t = S.indexOf(e);
        -1 != t && S.splice(t, 1)
    }
}, XPMobileSDK.library.PushConnectionObserverInterface = {
    onError: function (e) {
    }, onHTTPError: function (e) {
    }, onPushFailed: function () {
    }, notifyChannel: function (e) {
    }, notifyObservers: function (e) {
    }, videoConnectionTemporaryDown: function (e) {
    }, restart: function () {
    }
}, XPMobileSDK.library.PushConnection = function (e, t) {
    var n, o = (t.signalType, t.isSegmented, null);
    this.videoConnectionState = XPMobileSDK.library.VideoConnectionState.notOpened;
    var r = [];
    this.startCommunication = function () {
        if (!n) {
            try {
                n = new WebSocket(e)
            } catch (e) {
                if (this.videoConnectionState == XPMobileSDK.library.VideoConnectionState.closed) return;
                return console.error("WebSocket initialization failed. Falling back to AJAX..."), void l("onPushFailed")
            }
            n.binaryType = "arraybuffer", n.onerror = function (e) {
                l("onError", n)
            }, n.onopen = i, n.onclose = function () {
                l("onError", n), n = null
            }
        }
    }.bind(this), this.restartConnection = function (e) {
        console.log("Restarting socket."), this.startCommunication()
    }.bind(this), this.close = function () {
        n && (n.onopen = null, n.onmessage = null, n.onerror = null, n.onclose = null, n.close(), n = null, this.messageInterval && (clearInterval(this.messageInterval), this.messageInterval = null), console.log("WebSocket closed"))
    }.bind(this);
    var i = function (e) {
        n.onmessage = a, n.onerror = s, n.onclose = c, window.addEventListener("beforeunload", this.close), this.messageInterval = setInterval(function () {
            n && n.send("")
        }, NETWORK.websocketSendMessage), l("notifyChannel", !0), console.log("WebSocket open")
    }.bind(this), a = function (e) {
        o && (/*delete o, */o = null), o = new XPMobileSDK.library.VideoItem(e.data), l("notifyObservers", o)
    }, s = function (e) {
        console.error("WebSocket error"), console.log(e), this.messageInterval && (clearInterval(this.messageInterval), this.messageInterval = null)
    }.bind(this), c = function (e) {
        n.onopen = null, n.onmessage = null, n.onerror = null, n.onclose = null, n = null, this.messageInterval && (clearInterval(this.messageInterval), this.messageInterval = null), this.videoConnectionState == XPMobileSDK.library.VideoConnectionState.running && XPMobileSDK.library.Connection.connectionId && (this.restartConnection(), l("videoConnectionTemporaryDown"))
    }.bind(this);
    this.cleanupCommunication = function () {
        this.close()
    }, this.videoConnectionChangedState = function (e) {
        this.videoConnectionState = e
    }, this.addObserver = function (e) {
        r.push(e)
    }, this.removeObserver = function (e) {
        var t = r.indexOf(e);
        -1 != t && r.splice(t, 1)
    };
    var l = function (e, t) {
        r.forEach(function (n) {
            n && n[e] && n[e](t)
        })
    }
}, XPMobileSDK.library.VideoConnectionSignal = {
    live: 1,
    playback: 2
}, XPMobileSDK.library.VideoConnectionState = {
    notOpened: 0,
    running: 1,
    closed: 2
}, XPMobileSDK.library.VideoConnectionStream = {
    native: 1,
    segmented: 2,
    transcoded: 3
}, XPMobileSDK.library.VideoConnectionObserverInterface = {
    videoConnectionReceivedSegment: function (e) {
    }, videoConnectionReceivedFrame: function (e) {
    }, videoConnectionFailed: function () {
    }, videoConnectionTemporaryDown: function (e) {
    }, videoConnectionRecovered: function () {
    }, videoConnectionChangedState: function () {
    }, videoConnectionStreamingError: function () {
    }
}, XPMobileSDK.library.VideoConnection = function (e, t, n) {
    function o(e) {
        if (e.stream && e.stream.error) switch (e.stream.error) {
            case XPMobileSDK.library.VideoItem.Error.NonFatal:
                m.isSegmented = !1, m.request.parameters.StreamType = "Transcoded", m.restart();
                break;
            case XPMobileSDK.library.VideoItem.Error.Fatal:
                h("videoConnectionStreamingError"), m.close()
        } else {
            if (!(g.length > 0)) return console.log("Video connection received an item but doesn't have observer to send it to!"), void m.close();
            e.type == XPMobileSDK.library.VideoItem.Type.Segment ? h("videoConnectionReceivedSegment", e) : h("videoConnectionReceivedFrame", e), m.wasConnectionDown && (m.wasConnectionDown = !1, h("videoConnectionRecovered"))
        }
    }

    function r(e) {
        this.connected = !1, this.current;
        for (var t, n = [], o = 0; t = e["VideoChannel" + o]; o++) n.push(s(t));
        n.length || n.push(s(XPMobileSDKSettings.MobileServerURL + XPMobileSDKSettings.videoChanel)), console.log("Available video channels: ", n), this.getNext = function () {
            return this.connected || (this.current = n.shift()), this.current
        }.bind(this), this.hasNext = function () {
            return !this.connected && n.length
        }.bind(this), this.getNext()
    }

    function i(e) {
        v.connected = e
    }

    function a() {
        h("cleanupCommunication"), m.worker && XPMobileSDKSettings.supportsMultiThreaded && (m.worker.terminate(), m.worker = null)
    }

    function s(e) {
        if (!/^(http|ws)(s)?:/i.test(e)) {
            e = XPMobileSDK.library.Connection.server + e;
        }
        return m.isPush ? e.replace(/^http(s)?:/i, "ws$1:") : e.replace(/^ws(s)?:/i, "http$1:")
    }

    function c(e) {
        p != e && (p = e, h("videoConnectionChangedState", p))
    }

    function l() {
        n.onPushFailed()
    }

    function u(e) {
        v.connected && CommunicationStability.addVideoBreakDown(), d(e)
    }

    function d(e) {
        if (p != XPMobileSDK.library.VideoConnectionState.closed && null != XPMobileSDK.library.Connection.connectionId) {
            if (v.connected) if (e.status) {
                if (410 == e.status) return void h("restartConnection", e);
                f(e.status)
            } else e.readystate && e.readystate == WebSocket.CLOSED && h("restartConnection"); else {
                if (!v.hasNext()) return void h("videoConnectionNotAvailable");
                console.log("Try next video channel."), C = v.getNext()
            }
            h("startCommunication", NETWORK.requestTimeOnFailure)
        }
    }

    function f(e) {
        h("videoConnectionTemporaryDown", e), m.wasConnectionDown = !0
    }

    function h(e, t) {
        g.forEach(function (n) {
            n && n[e] && n[e](t), m.worker && m.worker.postMessage({message: e, arguments: t})
        })
    }

    if (XPMobileSDK.library.VideoConnection.instances.push(this), !n) var n = {};
    n.onClose = n.onClose || function (e) {
    }, n.onRestart = n.onRestart || function (e) {
    }, n.onPushFailed = n.onPushFailed || function () {
    };
    var m = this, g = [], p = XPMobileSDK.library.VideoConnectionState.notOpened;
    m.request = {
        parameters: t.params,
        options: t.options
    }, m.response = {parameters: t.response.outputParameters}, m.videoId = e, m.request.options && (m.cameraId = m.request.options.cameraId, m.signalType = m.request.options.signal, m.isReusable = m.request.options.reuseConnection), m.isPush = "Push" == m.request.parameters.MethodType, m.isSegmented = "Segmented" == m.request.parameters.StreamType, m.supportsPTZ = "Yes" == m.response.parameters.PTZ, m.supportsPTZPresets = "Yes" == m.response.parameters.Preset, m.supportsPlayback = "Yes" == m.response.parameters.Playback, m.supportsExport = "Yes" == m.response.parameters.ExportAvi;
    var b = null, v = new r(m.response.parameters), C = v.current;
    this.open = function () {
        switch (p) {
            case XPMobileSDK.library.VideoConnectionState.notOpened:
                c(XPMobileSDK.library.VideoConnectionState.running), window.Worker && XPMobileSDKSettings.supportsMultiThreaded ? (console.log("Opening multithreaded video connection " + m.videoId + " with Web Worker"), m.worker = new Worker("js/ThreadConnection.js"), m.worker.addEventListener("message", function (e) {
                    "onPushFailed" == e.data.message ? n.onPushFailed() : h(e.data.message, e.data.result)
                }, !1), m.worker.postMessage({
                    message: "startCommunication",
                    arguments: {
                        url: C + "/" + m.videoId + "/",
                        signalType: m.signalType,
                        isSegmented: m.isSegmented,
                        isPush: m.isPush
                    }
                })) : (m.isPush ? (console.log("Opening WebSocket video connection " + m.videoId), m.communication = new XPMobileSDK.library.PushConnection(C + "/" + m.videoId + "/", {
                    signalType: m.signalType,
                    isSegmented: m.isSegmented
                })) : (console.log("Opening AJAX video connection " + m.videoId), console.log(C + "/" + m.videoId + "/",{
                    signalType: m.signalType,
                    isSegmented: m.isSegmented
                }), m.communication = new XPMobileSDK.library.PullConnection(C + "/" + m.videoId + "/", {
                    signalType: m.signalType,
                    isSegmented: m.isSegmented
                })), m.communication.addObserver({
                    onError: d,
                    onHTTPError: u,
                    onPushFailed: l,
                    notifyChannel: i,
                    notifyObservers: o,
                    videoConnectionTemporaryDown: f,
                    restart: m.restart
                }), m.addObserver(m.communication), m.communication.startCommunication()), h("videoConnectionChangedState", p);
                break;
            case XPMobileSDK.library.VideoConnectionState.running:
                m.isReusable ? console.log("Opening a reusable video connection from the pool " + m.videoId) : console.log("WARNING: Attempting to open a running connection!");
                break;
            case XPMobileSDK.library.VideoConnectionState.closed:
                console.log("WARNING: Attempting to re-open a closed connection!")
        }
    }, this.restart = function () {
        p != XPMobileSDK.library.VideoConnectionState.closed && (console.log("Restarting video connection " + m.videoId + " for camera " + m.cameraId), c(XPMobileSDK.library.VideoConnectionState.closed), n.onRestart(m), a())
    }, this.close = function () {
        console.log('this.close1')
        if (p != XPMobileSDK.library.VideoConnectionState.closed) {
            if (m.isReusable && XPMobileSDK.library.VideoConnectionPool.hasDuplicatedStream(m.cameraId)) return void XPMobileSDK.library.VideoConnectionPool.removeInstance(m.cameraId);
            m.worker && XPMobileSDKSettings.supportsMultiThreaded && m.worker.terminate(), console.log("Closing video connection " + m.videoId + " for camera " + m.cameraId), c(XPMobileSDK.library.VideoConnectionState.closed), n.onClose(m), a()
        }
    }, this.addObserver = function (e) {
        g.push(e)
    }, this.removeObserver = function (e) {
        var t = g.indexOf(e);
        -1 != t && g.splice(t, 1)
    }, this.resetCommunication = function () {
        h("startCommunication")
    }, this.destroy = function () {
        var onAjaxComplete;
        var onAjaxFailure;
        var frameRequestParams;
// eslint-disable-next-line no-undef,no-undef
        var onAjaxLoading;
// eslint-disable-next-line no-undef
        m.close(), b && (b.destroy(), b = null), g = [], m.isPush || (onAjaxComplete = null, onAjaxFailure = null, onAjaxLoading = null, frameRequestParams = null, -1 != VideoConnection.indexOf(this) && VideoConnection.splice(VideoConnection.indexOf(this), 1))
    }, this.getState = function () {
        return p
    }
}, XPMobileSDK.library.VideoConnection.instances = [], XPMobileSDK.library.VideoItem = function (e) {
    function t() {
        if (C.dataSize > 0){
            if (l(), C.stream) {
                switch (C.stream.dataType) {
                    case"JPEG":
                        u();
                        break;
                    case"JSON":
                        d()
                }
            } else {
                u();
            }
        }
    }

    function n() {
        C.uuid = v(), C.timestamp = new Date(f(8)), C.frameNumber = f(4), C.dataSize = f(4), C.headerSize = f(2);
        var e = f(2);
        C.hasSizeInformation = e & XPMobileSDK.library.VideoItem.HeaderExtensionSize, C.hasLiveInformation = e & XPMobileSDK.library.VideoItem.HeaderExtensionLiveEvents, C.hasPlaybackInformation = e & XPMobileSDK.library.VideoItem.HeaderExtensionPlaybackEvents, C.hasNativeData = e & XPMobileSDK.library.VideoItem.HeaderExtensionNative, C.hasMotionInformation = e & XPMobileSDK.library.VideoItem.HeaderExtensionMotionEvents, C.hasLocationData = e & XPMobileSDK.library.VideoItem.HeaderExtensionLocationInfo, C.hasStreamInfo = e & XPMobileSDK.library.VideoItem.HeaderExtensionStreamInfo, C.hasCarouselInfo = e & XPMobileSDK.library.VideoItem.HeaderExtensionCarouselInfo, C.hasSizeInformation && o(), C.hasLiveInformation && r(), C.hasPlaybackInformation && i(), C.hasNativeData && f(f(4)), C.hasMotionInformation && a(), C.hasLocationData && f(f(4)), C.hasStreamInfo && s(), C.hasCarouselInfo && c()
    }

    function o() {
        C.sizeInfo = {
            sourceSize: {},
            sourceCrop: {},
            destinationSize: {}
        }, C.sizeInfo.sourceSize.width = f(4), C.sizeInfo.sourceSize.height = f(4), C.sizeInfo.sourceCrop.left = f(4), C.sizeInfo.sourceCrop.top = f(4), C.sizeInfo.sourceCrop.right = f(4), C.sizeInfo.sourceCrop.bottom = f(4), C.sizeInfo.sourceCrop.width = C.sizeInfo.sourceCrop.right - C.sizeInfo.sourceCrop.left, C.sizeInfo.sourceCrop.height = C.sizeInfo.sourceCrop.bottom - C.sizeInfo.sourceCrop.top, C.sizeInfo.destinationSize.width = f(4), C.sizeInfo.destinationSize.height = f(4), C.sizeInfo.destinationSize.resampling = f(4), C.sizeInfo.destinationSize.top = f(4), C.sizeInfo.destinationSize.right = f(4), C.sizeInfo.destinationSize.bottom = f(4)
    }

    function r() {
        C.currentLiveEvents = f(4), C.changedLiveEvents = f(4)
    }

    function i() {
        C.currentPlaybackEvents = f(4), C.changedPlaybackEvents = f(4)
    }

    function a() {
        C.motionHeaderSize = f(4), C.motionAmount = f(4)
    }

    function s() {
        C.stream = {}, C.stream.headerSize = f(4), C.stream.headerVesion = f(4), C.stream.validFields = f(4), C.stream.reserved = f(4), C.stream.timeBetweenFrames = f(4), C.stream.dataType = h(4), C.stream.rotation = f(4), C.stream.interlace = f(4), C.stream.error = f(4)
    }

    function c() {
        C.carousel = {}, C.carousel.headerSize = f(4), C.carousel.headerVesion = f(4), C.carousel.itemId = v()
    }

    function l() {
        C.data = new Uint8Array(e, C.headerSize, C.dataSize)
    }

    function u() {
        C.type = XPMobileSDK.library.VideoItem.Type.Frame, C.blob = new Blob([C.data], {type: "image/jpeg"})
    }

    function d() {
        var e = Base64.encodeArray(C.data), t = atob(e);
// eslint-disable-next-line no-undef
        Segment.call(C, t)
    }

    function f(t) {
        var n = new Uint8Array(e, S, t);
        S += t;
        for (var o = 0, r = 0; r < t; r++) o += n[r] * Math.pow(2, 8 * r);
        return o
    }

    function h(e) {
        for (var t = "", n = 0; n < e; n++) t += String.fromCharCode(f(1));
        return t
    }

    function m(e) {
        var t = "", n = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
        return t += n[(240 & e) >> 4], t += n[15 & e]
    }

    function g(t, n) {
        for (var o = new Uint8Array(e, S, t), r = n(o), i = "", a = 0; a < t; a++) i += m(r[a]);
        return S += t, i
    }

    function p(e) {
        return g(e, function (e) {
            return e
        })
    }

    function b(e) {
        return g(e, function (e) {
            return Array.prototype.reverse.call(e)
        })
    }

    function v() {
        var e = "";
        return e += b(4), e += "-", e += b(2), e += "-", e += b(2), e += "-", e += p(2), e += "-", e += p(6)
    }

    var C = this, S = 0;
    !function () {
        n(), t()
    }()
}, XPMobileSDK.library.VideoItem.Type = {}, XPMobileSDK.library.VideoItem.Type.Segment = 0, XPMobileSDK.library.VideoItem.Type.Frame = 1, XPMobileSDK.library.VideoItem.Error = {}, XPMobileSDK.library.VideoItem.Error.NonFatal = 1, XPMobileSDK.library.VideoItem.Error.Fatal = 2, XPMobileSDK.library.VideoItem.MainHeaderLength = 36, XPMobileSDK.library.VideoItem.SizeInfoHeaderLength = 32, XPMobileSDK.library.VideoItem.LiveInfoHeaderLength = 8, XPMobileSDK.library.VideoItem.PlaybackInfoHeaderLength = 8, XPMobileSDK.library.VideoItem.HeaderExtensionSize = 1, XPMobileSDK.library.VideoItem.HeaderExtensionLiveEvents = 2, XPMobileSDK.library.VideoItem.HeaderExtensionPlaybackEvents = 4, XPMobileSDK.library.VideoItem.HeaderExtensionNative = 8, XPMobileSDK.library.VideoItem.HeaderExtensionMotionEvents = 16, XPMobileSDK.library.VideoItem.HeaderExtensionLocationInfo = 32, XPMobileSDK.library.VideoItem.HeaderExtensionStreamInfo = 64, XPMobileSDK.library.VideoItem.HeaderExtensionCarouselInfo = 128, XPMobileSDK.library.VideoItem.LiveFlags = {}, XPMobileSDK.library.VideoItem.LiveFlags.LiveFeed = 1, XPMobileSDK.library.VideoItem.LiveFlags.Motion = 2, XPMobileSDK.library.VideoItem.LiveFlags.Recording = 4, XPMobileSDK.library.VideoItem.LiveFlags.Notification = 8, XPMobileSDK.library.VideoItem.LiveFlags.CameraConnectionLost = 16, XPMobileSDK.library.VideoItem.LiveFlags.DatabaseFail = 32, XPMobileSDK.library.VideoItem.LiveFlags.DiskFull = 64, XPMobileSDK.library.VideoItem.LiveFlags.ClientLiveStopped = 128, XPMobileSDK.library.VideoItem.PlaybackFlags = {}, XPMobileSDK.library.VideoItem.PlaybackFlags.Stopped = 1, XPMobileSDK.library.VideoItem.PlaybackFlags.Forward = 2, XPMobileSDK.library.VideoItem.PlaybackFlags.Backward = 4, XPMobileSDK.library.VideoItem.PlaybackFlags.DatabaseStart = 16, XPMobileSDK.library.VideoItem.PlaybackFlags.DatabaseEnd = 32, XPMobileSDK.library.VideoItem.PlaybackFlags.DatabaseError = 64, XPMobileSDK.library.VideoConnectionPool = new function () {
    var e = function (e) {
        this.id = e, this.videoConnection = void 0, this.response = void 0, this.count = 1, this.pendingCallbacks = []
    };
    this.cameras = [], this.containsCamera = function (e) {
        return !!t(e)
    }, this.containsCameraVideoConnection = function (e) {
        var n = t(e);
        return !!n && void 0 !== n.videoConnection
    }, this.pretendToOpenStream = function (e, n) {
        var o = t(e);
        return o.count++, void 0 !== o.videoConnection ? setTimeout(function () {
            n(o.videoConnection, o.response)
        }, 10) : o.pendingCallbacks.push(n), new XPMobileSDK.library.FakeConnectionRequest(e, n, o.videoConnection)
    }, this.addCameraId = function (t) {
        this.cameras.push(new e(t))
    }, this.addVideoConnection = function (e, n, o) {
        var r = t(e);
        r && (r.videoConnection = n, r.response = o, r.pendingCallbacks.forEach(function (e) {
            e(n, o)
        })), n || this.removeCamera(e)
    }, this.hasDuplicatedStream = function (e) {
        var n = t(e);
        return n && n.count > 1
    }, this.updateCameraResponse = function (e, n) {
        var o = t(e);
        o && (o.response = n)
    }, this.getCameraResponse = function (e) {
        return t(e).response
    }, this.removeInstance = function (e) {
        t(e).count--
    }, this.removeCamera = function (e) {
        this.cameras.splice(this.cameras.indexOf(t(e)), 1)
    }, this.cancelFakeRequest = function (e, n) {
        var o = t(e);
        if (o) {
            o.count--;
            var r = o.pendingCallbacks.indexOf(n);
            -1 != r && o.pendingCallbacks.splice(r, 1)
        }
    }, this.clear = function () {
        this.cameras = []
    };
    var t = function (e) {
        var t = void 0;
        return this.cameras.forEach(function (n) {
            n.id == e && (t = n)
        }), t
    }.bind(this)
}(), XPMobileSDK.library.VideoPushConnection = function (e, t, n) {
    function o() {
        return g
    }

    function r(e, t) {
        console.log('RequestPushStream: ', XPMobileSDK)
        C.onStreamSuccess = e || C.onStreamSuccess, C.onStreamError = t || C.onStreamError, s() || (m = XPMobileSDK.library.Connection.requestPushStream(a, () => {console.log('requestPushStreamFailed')}))
    }

    function i() {
        s() && (m && (XPMobileSDK.cancelRequest(m), m = null), h && (XPMobileSDK.closeStream(h.videoId), h = null))
    }

    function a(e, t) {
        if (m = null, !e) return void C.onStreamError(t);
        h = e, C.onStreamSuccess(p)
    }

    function s() {
        return h || m
    }

    function c(e) {
        var t = XPMobileSDK.library.Bytes.fromBase64(e), n = new ArrayBuffer(b + t.length), o = new Uint8Array(n);
        o.set(XPMobileSDK.library.Bytes.fromGuid(h.videoId, 16)), o.set(XPMobileSDK.library.Bytes.fromInt((new Date()).getTime(), 8), 16), o.set(XPMobileSDK.library.Bytes.fromInt(++v, 4), 24), o.set(XPMobileSDK.library.Bytes.fromInt(t.length, 4), 28), o.set(XPMobileSDK.library.Bytes.fromInt(b, 2), 32), o.set(XPMobileSDK.library.Bytes.fromInt(0, 2), 34), o.set(t, b);
        var r = XPMobileSDKSettings.MobileServerURL + XPMobileSDKSettings.videoChanel + "/" + h.videoId + "/",
            i = {method: "post", contentType: "arraybuffer", postBody: n, onLoading: l, onSuccess: u, onFailure: d};
        new XPMobileSDK.library.Ajax.Request(r, i)
    }

    function l(e) {
    }

    function u(e) {
    }

    function d(e) {
        console.log("ERROR in ajax request for video push with videoId " + h.videoId)
    }

    function f() {
        i(), g && (g.getTracks().forEach(function (e) {
            e.stop()
        }), g = null)
    }

    this.open = r, this.close = i, this.send = c, this.destroy = f, this.isOpen = s, this.getMediaStream = o;
    var h, m, g, p = this, b = 36, v = 0, C = {
        onSuccess: function (e) {
        }, onError: function (e) {
        }, onStreamSuccess: function (e) {
        }, onStreamError: function (e) {
        }
    };
    !function () {
        function o(e) {
            g = e, C.onSuccess(p)
        }

        function r(e) {
            console.log(e.name), C.onError(e)
        }

        if (C.onSuccess = e || C.onSuccess, C.onError = t || C.onError, n) return void C.onSuccess(p);
        navigator.mediaDevices.getUserMedia ? navigator.mediaDevices.getUserMedia({
            video: !0,
            audio: !1
        }).then(o).catch(r) : (navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia, navigator.getUserMedia ? navigator.getUserMedia({
            video: !0,
            audio: !1
        }, o, r) : console.log("Video push not supported!"))
    }()
}, XPMobileSDK.library.FakeConnectionRequest = function (e, t, n) {
    if (t && "function" === typeof t) {
        var o = XPMobileSDK.library.VideoConnectionPool.getCameraResponse(e), r = o && o.error ? o.error : null;
        t(n, r, o)
    }
    this.cancel = function () {
        XPMobileSDK.library.VideoConnectionPool.cancelFakeRequest(e, t)
    }
};

export { XPMobileSDK };


/**
 * @class ConnectionObserver
 * @type {Object}
 * @property {Function} connectionStateChanged - Sent to observers when the connection state changes in any way
 * @property {Function} connectionDidConnect - Sent to observers when connection has connected to the server and is about to send credentials
 * @property {Function} connectionFailedToConnect - Sent to observers when connection attempted to connect to the server but failed.
 * @property {Function} connectionFailedToConnectWithId - Sent to observers when connecting with external connection ID has failed.
 * @property {Function} connectionRequiresCode - Sent to observers when connection is in the process of logging in, but requires additional verification code.
 * @property {Function} connectionCodeError - Sent to observers when connection is in the process of logging in, a code has been sent to the server for verification, but this code is wrong.
 * @property {Function} connectionDidLogIn - Sent to observers when connection has logged in.
 * @property {Function} connectionFailedToLogIn - Sent to observers when connection has failed to log in.
 * @property {Function} connectionLostConnection - Sent to observers when connection to the server was lost.
 * @property {Function} connectionProcessingDisconnect - Sent to observers when the disconnect command is sent.
 * @property {Function} connectionDidDisconnect - Sent to observers when connection to the server was closed on request via disconnect method.
 * @property {Function} connectionSwitchedToPull - Sent to observers when all video connections have been switched to pull mode.
 * @property {Function} connectionRequestSucceeded - Sent to observers every time a request to the server has been received properly and without timeout or other terminal errors.
 */
XPMobileSDK.interfaces.ConnectionObserver = {

    /**
     * Sent to observers when the connection state changes in any way
     *
     * @method connectionStateChanged
     */
    connectionStateChanged: function () { },

    /**
     * Sent to observers when connection has connected to the server and is about to send credentials
     *
     * @method connectionDidConnect
     * @param {Object} parameters - the object containing the response parameters.
     */
    connectionDidConnect: function (parameters) { },

    /**
     * Sent to observers when connection attempted to connect to the server but failed.
     * Note that error may be a null object if we have failed to even parse the response from the server.
     *
     * @method connectionFailedToConnect
     */
    connectionFailedToConnect: function (error) { },

    /**
     * Sent to observers when connecting with external connection ID has failed.
     *
     * @method connectionFailedToConnectWithId
     */
    connectionFailedToConnectWithId: function (error) { },

    /**
     * Sent to observers when connection is in the process of logging in, but requires additional verification code.
     *
     * @method connectionRequiresCode
     * @param {String} provider - the provider used to send a verification code.
     */
    connectionRequiresCode: function (provider) { },

    /**
     * Sent to observers when connection is in the process of logging in, a code has been sent to the server for verification, but this code is wrong.
     *
     * @method connectionCodeError
     */
    connectionCodeError: function () { },

    /**
     * Sent to observers when connection has logged in.
     *
     * @method connectionDidLogIn
     */
    connectionDidLogIn: function () { },

    /**
     * Sent to observers when connection has failed to log in. Check the error to determine if it was due to incorrect credentials!
     * Note that error may be a null object if we have failed to even parse the response from the server.
     *
     * @method connectionFailedToLogIn
     */
    connectionFailedToLogIn: function (error) { },

    /**
     * Sent to observers when connection to the server was lost.
     *
     * @method connectionLostConnection
     */
    connectionLostConnection: function () { },

    /**
     * Sent to observers when the disconnect command is sent.
     *
     * @method connectionProcessingDisconnect
     */
    connectionProcessingDisconnect: function () { },

    /**
     * Sent to observers when connection to the server was closed on request via disconnect method.
     *
     * @method connectionDidDisconnect
     */
    connectionDidDisconnect: function () { },

    /**
     * Sent to observers when all video connections have been switched to pull mode.
     *
     * @method connectionSwitchedToPull
     */
    connectionSwitchedToPull: function () { },

    /**
     * Sent to observers every time a request to the server has been received properly and without timeout or other terminal errors.
     * You can use that to keep track of the connection and monitor it is properly working.
     *
     * @method connectionRequestSucceeded
     */
    connectionRequestSucceeded: function (request, response) {}
};

/**
 * @class VideoConnectionObserver
 * @type {Object}
 * @property {Function} videoConnectionReceivedSegment - Called when new stream segment has arrived over the video connection
 * @property {Function} videoConnectionReceivedFrame - Called when new frame has arrived over the video connection
 * @property {Function} videoConnectionFailed - Called when an error has occurred during video streaming or in one of the internal control commands which has
 *                                               resulted in closing the connection completely.
 * @property {Function} videoConnectionTemporaryDown - Called when a HTTP error occurred
 * @property {Function} videoConnectionRecovered - Called after the connection is no longer down due to an HTTP error.
 * @property {Function} videoConnectionChangedState - Called if the state property of the connection has changed value.
 * @property {Function} videoConnectionStreamingError - Called when the streaming technology is no longer available.
 */
XPMobileSDK.interfaces.VideoConnectionObserver = {

    /**
     * Called when new stream segment has arrived over the video connection
     *
     * @method videoConnectionReceivedSegment
     * @param {Object} segment - VideoItem object representing the segment
     */
    videoConnectionReceivedSegment: function (segment) { },


    /**
     * Called when new frame has arrived over the video connection
     *
     * @method videoConnectionReceivedFrame
     * @param {VideoItem} frame - VideoItem object representing the frame
     */
    videoConnectionReceivedFrame: function (frame) { },

    /**
     * Called when an error has occurred during video streaming or in one of the internal control commands which has
     * resulted in closing the connection completely.
     *
     * @method videoConnectionFailed
     */
    videoConnectionFailed: function () { },

    /**
     * Called when a HTTP error occurred
     *
     * @method videoConnectionTemporaryDown
     * @param {Number} errorCode - the HTTP error code returned from the server, or -1 if exception was thrown, or -2 if the request was aborted due to a missing response (happens more often on wireless networks)
     */
    videoConnectionTemporaryDown: function (errorCode) { },

    /**
     * Called after the connection is no longer down due to an HTTP error.
     *
     * @method videoConnectionRecovered
     */
    videoConnectionRecovered: function () { },

    /**
     * Called if the state property of the connection has changed value.
     *
     * @method videoConnectionChangedState
     */
    videoConnectionChangedState: function () { },

    /**
     * Called when the streaming technology is no longer available.
     *
     * @method videoConnectionStreamingError
     */
    videoConnectionStreamingError: function () {}
};

/**
 * @class ConnectionRequest
 * @type {Object}
 * @property {Object} params - All the params that need to be sent to the server
 * @property {Object} options - Options needed for custom logic before sending the connection request
 * @property {Object} response - Response of the connection request
 * @property {Object} cancel - Cancel the connection request
 */
XPMobileSDK.interfaces.ConnectionRequest = {

    params: Object(),
    options: Object(),
    response: Object(),

    cancel: function () {},
};

/**
 * @enum VideoConnectionSignal
 * @var {Number} live
 * @var {Number} playback
 */
XPMobileSDK.interfaces.VideoConnectionSignal = {

    live: 1,
    playback: 2
};

/**
 * @class VideoConnectionSize
 * @type {Object}
 * @property {Number} width - width of the video stream in pixels
 * @property {Number} height - height of the video stream in pixels
 */
XPMobileSDK.interfaces.VideoConnectionSize = {

    width: Number(),
    height: Number()
};

/**
 * @class VideoConnectionOptions
 * @type {Object}
 * @property {VideoConnectionSignal} signal - optional, live or playback stream
 * @property {Number} time - optional, timestamp for the playback stream
 * @property {Number} jpegCompressionLevel - optional, from 1 (best compression, worst quality) to 100 (worst compression, best quality)
 * @property {String} playbackControllerId - optional, for playback in multi-camera playback mode
 * @property {Boolean} keyFramesOnly - optional, receive only the key frames of the video stream
 * @property {Boolean} reuseConnection - optional, reuse existing connections for the same cameras
 */
XPMobileSDK.interfaces.VideoConnectionOptions = {

    signal: XPMobileSDK.interfaces.VideoConnectionSignal.live,
    time: Number(),
    jpegCompressionLevel: Number(),
    playbackControllerId: String(),
    keyFramesOnly: Boolean(),
    reuseConnection: Boolean()
};

/**
 * @class VideoConnectionCropping
 * @type {Object}
 * @property {Number} left - left offset of the cropping frame in pixels
 * @property {Number} top - top offset of the cropping frame in pixels
 * @property {Number} right - right offset of the cropping frame in pixels, overrides width
 * @property {Number} bottom - bottom offset of the cropping frame in pixels, overrides height
 * @property {Number} width - width of the cropping frame in pixels
 * @property {Number} height - height of the cropping frame in pixels
 */
XPMobileSDK.interfaces.VideoConnectionCropping = {

    left: Number(),
    top: Number(),
    right: Number(),
    bottom: Number(),
    width: Number(),
    height: Number()
};

/**
 * @class VideoConnection
 * @type {Object}
 * @property {String} videoId - GUID of the VideoConnection
 * @property {String} cameraId - GUID of the camera
 * @property {String} signalType - Type of the signal - Live, Playback or Upload.
 * @property {Boolean} isReusable - Flag indicating whether the connection reusable or not
 * @property {Boolean} isPush - Flag indicating whether it is a push connection
 * @property {Boolean} isSegmented -  Flag indicating whether it is segmented
 * @property {Boolean} supportsPTZ -  Flag indicating whether PTZ is supported
 * @property {Boolean} supportsPTZPresets - Flag indicating whether it PTZ Presets are supported
 * @property {Boolean} supportsPlayback - Flag indicating whether Playback is supported
 * @property {Boolean} supportsExport - Flag indicating whether Exports are supported
 * @property {Object} request - VideoConnection request data
 * @property {Object} response - VideoConnection response data
 * @property {Function} open - Opens the connection to start receiving frames.
 * @property {Function} restart -Restarts the connection.
 * @property {Function} close - Closes the connection.
 * @property {Function} addObserver - Adds an observer for the video connection.
 * @property {Function} removeObserver - Removes an observer for the video connection.
 * @property {Function} resetCommunication - Resets communication
 * @property {Function} destroy - Class destructor.
 */
XPMobileSDK.interfaces.VideoConnection = {

    /**
     * @property {String} videoId - GUID of the VideoConnection
     */
    videoId: String(),

    /**
     * @property {String} cameraId - GUID of the camera
     */
    cameraId: String(),

    /**
     * @property {String} signalType - Type of the signal - Live, Playback or Upload.
     */
    signalType: String(),

    /**
     * @property {Boolean} isReusable - Flag indicating whether the connection reusable or not
     */
    isReusable: Boolean(),

    /**
     * @property {Boolean} isPush - Flag indicating whether it is a push connection
     */
    isPush: Boolean(),

    /**
     * @property {Boolean} isSegmented -  Flag indicating whether it is segmented
     */
    isSegmented: Boolean(),

    /**
     * @property {Boolean} supportsPTZ -  Flag indicating whether PTZ is supported
     */
    supportsPTZ: Boolean(),

    /**
     * @property {Boolean} supportsPTZPresets - Flag indicating whether it PTZ Presets are supported
     */
    supportsPTZPresets: Boolean(),

    /**
     * @property {Boolean} supportsPlayback - Flag indicating whether Playback is supported
     */
    supportsPlayback: Boolean(),

    /**
     * @property {Boolean} supportsExport - Flag indicating whether Exports are supported
     */
    supportsExport: Boolean(),


    /**
     * @property {Object} request - VideoConnection request data
     */
    request: { parameters: Object(), options: Object() },

    /**
     * @property {Object} response - VideoConnection response data
     */
    response: { parameters: Object() },

    /**
     * Opens the connection to start receiving frames.
     *
     * @method open
     */
    open: function () { },

    /**
     * Restarts the connection.
     *
     * @method restart
     */
    restart: function () { },

    /**
     * Closes the connection.
     *
     * @method close
     */
    close: function () { },

    /**
     * Adds an observer for the video connection.
     *
     * @method addObserver
     * @param {Object} observer - Any object. Should implement methods from the VideoConnectionObserverInterface.
     */
    addObserver: function (observer) { },

    /**
     * Removes an observer for the video connection.
     *
     * @method removeObserver
     * @param {Object} observer - Any object implementing VideoConnectionObserverInterface that should not receive further notifications
     */
    removeObserver: function (observer) { },

    /**
     * Resets communication
     *
     * @method resetCommunication
     */
    resetCommunication: function () { },

    /**
     * Class destructor.
     *
     * @method destroy
     */
    destroy: function () {}
};


/**
 * @class VideoPushConnection
 * @type {Object}
 * @property {Function} open - Opens the video push connection
 * @property {Function} close - Closes the video push connection
 * @property {Function} send - Sends video frame to server
 * @property {Function} destroy - Class destructor
 * @property {Function} isOpen - Checks if the connection is open
 * @property {Function} getMediaStream - Retrieves a media stream
 */
XPMobileSDK.interfaces.VideoPushConnection = {

    /**
     * Opens the video push connection
     *
     * @method open
     */
    open: function (successCallback, errorCallback) { },

    /**
     * Closes the video push connection
     *
     * @method close
     */
    close: function () { },

    /**
     * Sends video frame to server
     *
     * @method send
     */
    send: function (base64EncodedImage) { },

    /**
     * Class destructor
     *
     * @method destroy
     */
    destroy: function () { },

    /**
     * Checks if the connection is open
     *
     * @method isOpen
     *
     * @return Boolean - Returns the stream object if the connection is opened
     */
    isOpen: function () { return Boolean(); },

    /**
     *   Retrieves a media stream
     *
     * @method getMediaStream
     */
    getMediaStream: function () { return new MediaStream(); }
};