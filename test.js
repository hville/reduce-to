var t = require('cotest'),
		x = require('./index')

function toObj(m) {
	return x(m, {})
}

t('array', ()=>{
	t('{==}', x([1,2,3]), [1,2,3], 'cloning')
	t('{==}', x([1,2,3], [0]), [0,1,2,3], 'merge')
	t('{==}', x([1,2,3], x.map(v=>2*v)), [2,4,6], 'map')
	t('{==}', x([1,2,3], x.filter(v=>v<3)), [1,2], 'filter')
	t('{==}', x([1,2,3], x.filter(v=>v<3), x.map(v=>2*v)), [2,4], 'compose')
})

t('string', ()=>{
	t('===', x('abc'), 'abc', 'cloning')
	t('===', x('abc', 'Z'), 'Zabc', 'merge')
	t('===', x('abc', x.map(v=>v.toUpperCase())), 'ABC', 'map')
	t('===', x('abc', x.filter(v=>v!=='b')), 'ac', 'filter')
	t('===', x('abc', x.filter(v=>v!=='b'), x.map(v=>v.toUpperCase())), 'AC', 'compose')
})

t('object', ()=>{
	t('{==}', x({a:'a', b:'b'}), {a:'a', b:'b'}, 'cloning')
	t('{==}', x({a:'a', b:'b'}, {c: 'c'}), {a:'a', b:'b', c:'c'}, 'merge')
	t('{==}', x({a:'a', b:'b'}, x.map(v=>v.toUpperCase())), {a:'A', b:'B'}, 'map')
	t('{==}', x({a:'a', b:'b'}, x.filter(v=>v!=='b')), {a:'a'}, 'filter')
	t('{==}', x({a:'a', b:'b'}, x.filter(v=>v!=='b'), x.map(v=>v.toUpperCase())), {a:'A'}, 'compose')
})

t('map', ()=>{
	var map = new Map([['a', 'a'],['b', 'b']])

	t('{==}', toObj(x(map)), {a:'a', b:'b'}, 'cloning')
	t('{==}', toObj(x(map, new Map([['c','c']]))), {a:'a', b:'b', c:'c'}, 'merge')
	t('{==}', toObj(x(map, x.map(v=>v.toUpperCase()))), {a:'A', b:'B'}, 'map')
	t('{==}', toObj(x(map, x.filter(v=>v!=='b'))), {a:'a'}, 'filter')
	t('{==}', toObj(x(map, x.filter(v=>v!=='b'), x.map(v=>v.toUpperCase()))), {a:'A'}, 'compose')
})

t('iterator', ()=>{
	var arr = new Int8Array([1,2,3]) /*global Int8Array*/
	t('{==}', x(arr), [1,2,3], 'cloning')
	t('{==}', x(arr, [0]), [0,1,2,3], 'merge')
	t('{==}', x(arr, x.map(v=>2*v)), [2,4,6], 'map')
	t('{==}', x(arr, x.filter(v=>v<3)), [1,2], 'filter')
	t('{==}', x(arr, x.filter(v=>v<3), x.map(v=>2*v)), [2,4], 'compose')
})

t('mix type ... to ...', ()=>{
	var xf = x.filter(v=>v!=='b'),
			xm = x.map(v=>v.toUpperCase()),
			xi = x.index((v,i)=> i<1),
			map = new Map([['a', 'a'],['b', 'b'],['c', 'c']])

	t('===', x(['a','b','c'], xf, xm, 'z'), 'zAC', 'compose A->S')
	t('===', x({a:'a', b:'b', c:'c'}, xf, xm, 'z'), 'zAC', 'compose O->S')
	t('===', x(map, xf, xm, 'z'), 'zAC', 'compose M->S')

	t('{==}', x(['a','b'], xf, xm, {z:'z'}), {0:'A', z:'z'}, 'compose A->O')
	t('{==}', x('ab', xf, xm, {z:'z'}), {0:'A', z:'z'}, 'compose S->O')
	t('{==}', x(map, xf, xm, {z:'z'}), {a:'A', c:'C', z:'z'}, 'compose M->O')

	t('{==}', x('ab', xf, xm, ['z']), ['z', 'A'], 'compose S->A')
	t('{==}', x({a:'a', b:'b'}, xf, xm, ['z']), ['z', 'A'], 'compose O->A')
	t('{==}', x(map, xf, xm, xi, ['z']), ['z', 'A'], 'compose M->A')
})
