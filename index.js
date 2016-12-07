function reduceTo(src) {
	for (var i=0, len=arguments.length-1, args=Array(len); i<len; ++i) args[i] = arguments[i+1]
	return transform(src, args)
}
reduceTo.map = map
reduceTo.filter = filter
reduceTo.index = index

module.exports = reduceTo

function transform(src, args) {
	var sTyp = cType(src),
			reduce = sourceIterator(sTyp)
	// if source type is not valid, default to iterators if possible
	if (!reduce) {
		if (Array.from && typeof Symbol && Symbol && src[Symbol.iterator]) return transform(Array.from(src), args)
		else throw Error('invalid target type ' + sTyp.name)
	}
	var tTyp = cType(args[args.length-1]),
			tgt = (!args.length || tTyp === Function) ? createTarget(tTyp=sTyp) : args.pop(),
			xfo = targetReducer(tTyp)

	while(args.length) xfo = args.pop()(xfo)

	return reduce(src, xfo, tgt)
}

// TRANSDUCERS
function map(mapper) {
	return function(reducer) {
		return function reduce(acc, val, key, src) {
			return reducer(acc, mapper(val, key, src), key)
		}
	}
}
function filter(tester) {
	return function (reducer) {
		return function reduce(acc, val, key, src) {
			return tester(val, key, src) ? reducer(acc, val, key, src) : acc
		}
	}
}
function index(tester) {
	return function (reducer) {
		var idx = 0
		return function reduce(acc, val, key, src) {
			return tester(val, idx++, src) ? reducer(acc, val, key, src) : acc
		}
	}
}

// TYPE UTILS
function createTarget(typ) {
	switch (typ) {
		case String: return ''
		case Array: case Object: case Map: case Set:
			return new typ
	}
	throw Error('invalid target type ' + typ.name)
}
function sourceIterator(typ) {
	switch (typ) {
		case String:
		case Array:
			return fromArrayLike
		case Object: return fromObject
		case Map: return fromMap
		case Set: return fromSet
	}
}
function targetReducer(typ) {
	switch (typ) {
		case Array: return toArray
		case String: return toString
		case Object: return toObject
		case Map: case WeakMap:
			return toMap
		case Set: case WeakSet:
			return toSet
	}
	throw Error('invalid target type ' + typ.name)
}

function toString(tgt, v) { return tgt + v }
function toArray(tgt, v) { tgt.push(v); return tgt }
function toObject(tgt, v, k) { tgt[k] = v; return tgt }
function toMap(tgt, v, k) { return tgt.set(k, v) }
function toSet(tgt, v) { return tgt.add(v) }

function fromArrayLike(src, xfo, tgt) {
	for (var i=0; i<src.length; ++i) tgt = xfo(tgt, src[i], i)
	return tgt
}
function fromObject(src, xfo, tgt) {
	for (var i=0, ks=Object.keys(src); i<ks.length; ++i) tgt = xfo(tgt, src[ks[i]], ks[i])
	return tgt
}
function fromMap(src, xfo, tgt) {
	src.forEach(function(v, k) { tgt = xfo(tgt, v, '' + k) })
	return tgt
}
function fromSet(src, xfo, tgt) {
	var i = 0
	src.forEach(function(v) { tgt = xfo(tgt, v, i++) })
	return tgt
}

// UTILS
function cType(t) {
	return t === undefined ? undefined : t === null ? null : t.constructor || Object
}
