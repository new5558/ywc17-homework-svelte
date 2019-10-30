
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function create_slot(definition, ctx, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, fn) {
        return definition[1]
            ? assign({}, assign(ctx.$$scope.ctx, definition[1](fn ? fn(ctx) : {})))
            : ctx.$$scope.ctx;
    }
    function get_slot_changes(definition, ctx, changed, fn) {
        return definition[1]
            ? assign({}, assign(ctx.$$scope.changed || {}, definition[1](fn ? fn(changed) : {})))
            : ctx.$$scope.changed || {};
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function update_keyed_each(old_blocks, changed, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(changed, child_ctx);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
                return ret;
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src\components\sections\Navbar.svelte generated by Svelte v3.12.1 */

    const file = "src\\components\\sections\\Navbar.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.item = list[i];
    	return child_ctx;
    }

    // (153:6) {#each items as item (item.label)}
    function create_each_block(key_1, ctx) {
    	var li, a, t0_value = ctx.item.label + "", t0, a_href_value, t1;

    	const block = {
    		key: key_1,

    		first: null,

    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", a_href_value = ctx.item.href);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-1axec5u");
    			add_location(a, file, 154, 10, 3880);
    			attr_dev(li, "class", "navbar-text svelte-1axec5u");
    			add_location(li, file, 153, 8, 3844);
    			this.first = li;
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t0);
    			append_dev(li, t1);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.items) && t0_value !== (t0_value = ctx.item.label + "")) {
    				set_data_dev(t0, t0_value);
    			}

    			if ((changed.items) && a_href_value !== (a_href_value = ctx.item.href)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(li);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block.name, type: "each", source: "(153:6) {#each items as item (item.label)}", ctx });
    	return block;
    }

    function create_fragment(ctx) {
    	var div7, div5, img, t0, div4, div3, div0, t1, div1, t2, div2, t3, div6, ul, each_blocks = [], each_1_lookup = new Map(), dispose;

    	let each_value = ctx.items;

    	const get_key = ctx => ctx.item.label;

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div5 = element("div");
    			img = element("img");
    			t0 = space();
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			div2 = element("div");
    			t3 = space();
    			div6 = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			attr_dev(img, "class", "mobile-logo svelte-1axec5u");
    			attr_dev(img, "alt", "logo");
    			attr_dev(img, "src", "./image/information-logo.png");
    			add_location(img, file, 141, 4, 3290);
    			attr_dev(div0, "class", "hamburger-inner hamburger-inner-1 svelte-1axec5u");
    			add_location(div0, file, 144, 8, 3485);
    			attr_dev(div1, "class", "hamburger-inner hamburger-inner-2 svelte-1axec5u");
    			add_location(div1, file, 145, 8, 3544);
    			attr_dev(div2, "class", "hamburger-inner hamburger-inner-3 svelte-1axec5u");
    			add_location(div2, file, 146, 8, 3603);
    			attr_dev(div3, "class", "hamburger-box svelte-1axec5u");
    			add_location(div3, file, 143, 6, 3448);
    			attr_dev(div4, "class", "hamburger svelte-1axec5u");
    			toggle_class(div4, "hamburger-open", ctx.isOpen);
    			add_location(div4, file, 142, 4, 3369);
    			attr_dev(div5, "class", "mobile-navbar svelte-1axec5u");
    			add_location(div5, file, 140, 2, 3257);
    			attr_dev(ul, "class", "svelte-1axec5u");
    			add_location(ul, file, 151, 4, 3788);
    			attr_dev(div6, "class", "navbar-container svelte-1axec5u");
    			toggle_class(div6, "dropdown-open", ctx.isOpen);
    			toggle_class(div6, "dropdown-close", !ctx.isOpen);
    			add_location(div6, file, 150, 2, 3692);
    			attr_dev(div7, "class", "navbar svelte-1axec5u");
    			add_location(div7, file, 139, 0, 3233);
    			dispose = listen_dev(div4, "click", ctx.toggle);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div5);
    			append_dev(div5, img);
    			append_dev(div5, t0);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div7, t3);
    			append_dev(div7, div6);
    			append_dev(div6, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},

    		p: function update(changed, ctx) {
    			if (changed.isOpen) {
    				toggle_class(div4, "hamburger-open", ctx.isOpen);
    			}

    			const each_value = ctx.items;
    			each_blocks = update_keyed_each(each_blocks, changed, get_key, 1, ctx, each_value, each_1_lookup, ul, destroy_block, create_each_block, null, get_each_context);

    			if (changed.isOpen) {
    				toggle_class(div6, "dropdown-open", ctx.isOpen);
    				toggle_class(div6, "dropdown-close", !ctx.isOpen);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div7);
    			}

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { items = [] } = $$props;
      let isOpen = false;
      function toggle() {
        $$invalidate('isOpen', isOpen = !isOpen);
      }

    	const writable_props = ['items'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('items' in $$props) $$invalidate('items', items = $$props.items);
    	};

    	$$self.$capture_state = () => {
    		return { items, isOpen };
    	};

    	$$self.$inject_state = $$props => {
    		if ('items' in $$props) $$invalidate('items', items = $$props.items);
    		if ('isOpen' in $$props) $$invalidate('isOpen', isOpen = $$props.isOpen);
    	};

    	return { items, isOpen, toggle };
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["items"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Navbar", options, id: create_fragment.name });
    	}

    	get items() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\sections\Banner.svelte generated by Svelte v3.12.1 */

    const file$1 = "src\\components\\sections\\Banner.svelte";

    function create_fragment$1(ctx) {
    	var div3, div0, t0, div1, img, t1, div2;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			img = element("img");
    			t1 = space();
    			div2 = element("div");
    			attr_dev(div0, "class", "banner-left banner svelte-12cygtu");
    			add_location(div0, file$1, 30, 2, 707);
    			attr_dev(img, "class", "banner-image svelte-12cygtu");
    			attr_dev(img, "src", "./image/banner.png");
    			attr_dev(img, "alt", "banner");
    			add_location(img, file$1, 32, 4, 785);
    			attr_dev(div1, "class", "banner-center banner svelte-12cygtu");
    			add_location(div1, file$1, 31, 2, 745);
    			attr_dev(div2, "class", "banner-right banner svelte-12cygtu");
    			add_location(div2, file$1, 34, 2, 865);
    			attr_dev(div3, "class", "banner-container svelte-12cygtu");
    			add_location(div3, file$1, 29, 0, 673);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div1, img);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div3);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$1.name, type: "component", source: "", ctx });
    	return block;
    }

    class Banner extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$1, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Banner", options, id: create_fragment$1.name });
    	}
    }

    /* src\components\sections\Announcement.svelte generated by Svelte v3.12.1 */

    const file$2 = "src\\components\\sections\\Announcement.svelte";

    function create_fragment$2(ctx) {
    	var div4, div0, t1, div1, t2, t3, div3, div2, button, t4, br0, t5, br1, t6, br2, t7, hr;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			div0.textContent = "ตั้งแต่วันที่";
    			t1 = space();
    			div1 = element("div");
    			t2 = text(ctx.duration);
    			t3 = space();
    			div3 = element("div");
    			div2 = element("div");
    			button = element("button");
    			t4 = text("ลงทะเบียนเฟส 2\r\n        ");
    			br0 = element("br");
    			t5 = text("\r\n        ตั้งแต่วันที่ 24 ต.ค. 62 วันล่ะ 2 รอบ เวลา 6.00 และ 18:00 น.\r\n        ");
    			br1 = element("br");
    			t6 = text("\r\n        (จำกัดผู้ลงทะเบียนรอบล่ะ 5 แสนคน รวม 1 ล้านคนต่อวัน)\r\n        ");
    			br2 = element("br");
    			t7 = space();
    			hr = element("hr");
    			attr_dev(div0, "class", "since svelte-oqv49a");
    			add_location(div0, file$2, 67, 2, 1340);
    			attr_dev(div1, "class", "duration svelte-oqv49a");
    			add_location(div1, file$2, 68, 2, 1382);
    			add_location(br0, file$2, 73, 8, 1542);
    			add_location(br1, file$2, 75, 8, 1628);
    			add_location(br2, file$2, 77, 8, 1706);
    			attr_dev(button, "class", "svelte-oqv49a");
    			add_location(button, file$2, 71, 6, 1500);
    			attr_dev(div2, "class", "button-container-2 svelte-oqv49a");
    			add_location(div2, file$2, 70, 4, 1460);
    			attr_dev(hr, "class", "svelte-oqv49a");
    			add_location(hr, file$2, 80, 4, 1747);
    			attr_dev(div3, "class", "button-container svelte-oqv49a");
    			add_location(div3, file$2, 69, 2, 1424);
    			attr_dev(div4, "class", "header-container svelte-oqv49a");
    			add_location(div4, file$2, 66, 0, 1306);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div4, t1);
    			append_dev(div4, div1);
    			append_dev(div1, t2);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, button);
    			append_dev(button, t4);
    			append_dev(button, br0);
    			append_dev(button, t5);
    			append_dev(button, br1);
    			append_dev(button, t6);
    			append_dev(button, br2);
    			append_dev(div3, t7);
    			append_dev(div3, hr);
    		},

    		p: function update(changed, ctx) {
    			if (changed.duration) {
    				set_data_dev(t2, ctx.duration);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div4);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$2.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { duration = '' } = $$props;

    	const writable_props = ['duration'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Announcement> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('duration' in $$props) $$invalidate('duration', duration = $$props.duration);
    	};

    	$$self.$capture_state = () => {
    		return { duration };
    	};

    	$$self.$inject_state = $$props => {
    		if ('duration' in $$props) $$invalidate('duration', duration = $$props.duration);
    	};

    	return { duration };
    }

    class Announcement extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$2, safe_not_equal, ["duration"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Announcement", options, id: create_fragment$2.name });
    	}

    	get duration() {
    		throw new Error("<Announcement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Announcement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\sections\About.svelte generated by Svelte v3.12.1 */

    const file$3 = "src\\components\\sections\\About.svelte";

    function create_fragment$3(ctx) {
    	var div7, div6, div5, div0, t0, br, t1, t2, div1, t3, div4, div2, t5, div3;

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			div0 = element("div");
    			t0 = text("มาตรการส่งเสริมการบริโภค\r\n        ");
    			br = element("br");
    			t1 = text("\r\n        ในประเทศ “ชิมช้อปใช้”");
    			t2 = space();
    			div1 = element("div");
    			t3 = space();
    			div4 = element("div");
    			div2 = element("div");
    			div2.textContent = "เงื่อนไขการเข้าร่วมมาตรการ";
    			t5 = space();
    			div3 = element("div");
    			add_location(br, file$3, 63, 8, 1330);
    			attr_dev(div0, "class", "title svelte-1xy7z7g");
    			add_location(div0, file$3, 61, 6, 1267);
    			attr_dev(div1, "class", "detail detail-description svelte-1xy7z7g");
    			add_location(div1, file$3, 66, 6, 1389);
    			attr_dev(div2, "class", "detail detail-topic svelte-1xy7z7g");
    			add_location(div2, file$3, 70, 8, 1507);
    			attr_dev(div3, "class", "detail detail-condition svelte-1xy7z7g");
    			add_location(div3, file$3, 71, 8, 1582);
    			attr_dev(div4, "class", "condition svelte-1xy7z7g");
    			add_location(div4, file$3, 69, 6, 1474);
    			attr_dev(div5, "class", "content svelte-1xy7z7g");
    			add_location(div5, file$3, 60, 4, 1238);
    			attr_dev(div6, "class", "container svelte-1xy7z7g");
    			add_location(div6, file$3, 59, 2, 1209);
    			attr_dev(div7, "class", "container-center svelte-1xy7z7g");
    			add_location(div7, file$3, 58, 0, 1175);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div0);
    			append_dev(div0, t0);
    			append_dev(div0, br);
    			append_dev(div0, t1);
    			append_dev(div5, t2);
    			append_dev(div5, div1);
    			div1.innerHTML = ctx.detail;
    			append_dev(div5, t3);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div4, t5);
    			append_dev(div4, div3);
    			div3.innerHTML = ctx.condition;
    		},

    		p: function update(changed, ctx) {
    			if (changed.detail) {
    				div1.innerHTML = ctx.detail;
    			}

    			if (changed.condition) {
    				div3.innerHTML = ctx.condition;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div7);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$3.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { detail = '', condition = '' } = $$props;

    	const writable_props = ['detail', 'condition'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('detail' in $$props) $$invalidate('detail', detail = $$props.detail);
    		if ('condition' in $$props) $$invalidate('condition', condition = $$props.condition);
    	};

    	$$self.$capture_state = () => {
    		return { detail, condition };
    	};

    	$$self.$inject_state = $$props => {
    		if ('detail' in $$props) $$invalidate('detail', detail = $$props.detail);
    		if ('condition' in $$props) $$invalidate('condition', condition = $$props.condition);
    	};

    	return { detail, condition };
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$3, safe_not_equal, ["detail", "condition"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "About", options, id: create_fragment$3.name });
    	}

    	get detail() {
    		throw new Error("<About>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set detail(value) {
    		throw new Error("<About>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get condition() {
    		throw new Error("<About>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set condition(value) {
    		throw new Error("<About>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\sections\contact\ContactBanner.svelte generated by Svelte v3.12.1 */

    const file$4 = "src\\components\\sections\\contact\\ContactBanner.svelte";

    function create_fragment$4(ctx) {
    	var a, img;

    	const block = {
    		c: function create() {
    			a = element("a");
    			img = element("img");
    			attr_dev(img, "src", ctx.src);
    			attr_dev(img, "alt", ctx.alt);
    			add_location(img, file$4, 12, 2, 216);
    			attr_dev(a, "href", ctx.href);
    			attr_dev(a, "class", "svelte-9lv6yk");
    			add_location(a, file$4, 11, 0, 202);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, img);
    		},

    		p: function update(changed, ctx) {
    			if (changed.src) {
    				attr_dev(img, "src", ctx.src);
    			}

    			if (changed.alt) {
    				attr_dev(img, "alt", ctx.alt);
    			}

    			if (changed.href) {
    				attr_dev(a, "href", ctx.href);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(a);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$4.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { src = '', href = '', alt = '' } = $$props;

    	const writable_props = ['src', 'href', 'alt'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<ContactBanner> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('src' in $$props) $$invalidate('src', src = $$props.src);
    		if ('href' in $$props) $$invalidate('href', href = $$props.href);
    		if ('alt' in $$props) $$invalidate('alt', alt = $$props.alt);
    	};

    	$$self.$capture_state = () => {
    		return { src, href, alt };
    	};

    	$$self.$inject_state = $$props => {
    		if ('src' in $$props) $$invalidate('src', src = $$props.src);
    		if ('href' in $$props) $$invalidate('href', href = $$props.href);
    		if ('alt' in $$props) $$invalidate('alt', alt = $$props.alt);
    	};

    	return { src, href, alt };
    }

    class ContactBanner extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$4, safe_not_equal, ["src", "href", "alt"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "ContactBanner", options, id: create_fragment$4.name });
    	}

    	get src() {
    		throw new Error("<ContactBanner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set src(value) {
    		throw new Error("<ContactBanner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<ContactBanner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<ContactBanner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alt() {
    		throw new Error("<ContactBanner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alt(value) {
    		throw new Error("<ContactBanner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\sections\contact\Contact.svelte generated by Svelte v3.12.1 */

    const file$5 = "src\\components\\sections\\contact\\Contact.svelte";

    function create_fragment$5(ctx) {
    	var div1, div0, t0, t1, current;

    	var contactbanner0 = new ContactBanner({
    		props: {
    		href: "tel:021111144",
    		src: "./image/Banner_KTB_SQ.png",
    		alt: "Banner_KTB_SQ"
    	},
    		$$inline: true
    	});

    	var contactbanner1 = new ContactBanner({
    		props: {
    		href: "tel:022706400",
    		src: "./image/Banner_CGD_Sq.png",
    		alt: "Banner_CGD_Sq"
    	},
    		$$inline: true
    	});

    	var contactbanner2 = new ContactBanner({
    		props: {
    		href: "tel:1672",
    		src: "./image/Banner_TAT_Hotline_Sq.png",
    		alt: "Banner_TAT_Hotline_Sq"
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			contactbanner0.$$.fragment.c();
    			t0 = space();
    			contactbanner1.$$.fragment.c();
    			t1 = space();
    			contactbanner2.$$.fragment.c();
    			attr_dev(div0, "class", "image-container svelte-ojbi9p");
    			add_location(div0, file$5, 20, 2, 460);
    			attr_dev(div1, "class", "information-container svelte-ojbi9p");
    			add_location(div1, file$5, 19, 0, 421);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(contactbanner0, div0, null);
    			append_dev(div0, t0);
    			mount_component(contactbanner1, div0, null);
    			append_dev(div0, t1);
    			mount_component(contactbanner2, div0, null);
    			current = true;
    		},

    		p: noop,

    		i: function intro(local) {
    			if (current) return;
    			transition_in(contactbanner0.$$.fragment, local);

    			transition_in(contactbanner1.$$.fragment, local);

    			transition_in(contactbanner2.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(contactbanner0.$$.fragment, local);
    			transition_out(contactbanner1.$$.fragment, local);
    			transition_out(contactbanner2.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div1);
    			}

    			destroy_component(contactbanner0);

    			destroy_component(contactbanner1);

    			destroy_component(contactbanner2);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$5.name, type: "component", source: "", ctx });
    	return block;
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$5, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Contact", options, id: create_fragment$5.name });
    	}
    }

    /* src\components\sections\sponsor\SponsorImage.svelte generated by Svelte v3.12.1 */

    const file$6 = "src\\components\\sections\\sponsor\\SponsorImage.svelte";

    function create_fragment$6(ctx) {
    	var a, img;

    	const block = {
    		c: function create() {
    			a = element("a");
    			img = element("img");
    			attr_dev(img, "src", ctx.src);
    			attr_dev(img, "alt", ctx.alt);
    			attr_dev(img, "class", "svelte-1kt03vk");
    			add_location(img, file$6, 26, 2, 518);
    			attr_dev(a, "href", ctx.href);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-1kt03vk");
    			add_location(a, file$6, 25, 0, 488);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, img);
    		},

    		p: function update(changed, ctx) {
    			if (changed.src) {
    				attr_dev(img, "src", ctx.src);
    			}

    			if (changed.alt) {
    				attr_dev(img, "alt", ctx.alt);
    			}

    			if (changed.href) {
    				attr_dev(a, "href", ctx.href);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(a);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$6.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { src = '', alt = '', href = '' } = $$props;

    	const writable_props = ['src', 'alt', 'href'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<SponsorImage> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('src' in $$props) $$invalidate('src', src = $$props.src);
    		if ('alt' in $$props) $$invalidate('alt', alt = $$props.alt);
    		if ('href' in $$props) $$invalidate('href', href = $$props.href);
    	};

    	$$self.$capture_state = () => {
    		return { src, alt, href };
    	};

    	$$self.$inject_state = $$props => {
    		if ('src' in $$props) $$invalidate('src', src = $$props.src);
    		if ('alt' in $$props) $$invalidate('alt', alt = $$props.alt);
    		if ('href' in $$props) $$invalidate('href', href = $$props.href);
    	};

    	return { src, alt, href };
    }

    class SponsorImage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$6, safe_not_equal, ["src", "alt", "href"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "SponsorImage", options, id: create_fragment$6.name });
    	}

    	get src() {
    		throw new Error("<SponsorImage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set src(value) {
    		throw new Error("<SponsorImage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alt() {
    		throw new Error("<SponsorImage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alt(value) {
    		throw new Error("<SponsorImage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<SponsorImage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<SponsorImage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\sections\sponsor\Sponsor.svelte generated by Svelte v3.12.1 */

    const file$7 = "src\\components\\sections\\sponsor\\Sponsor.svelte";

    function create_fragment$7(ctx) {
    	var div1, div0, t0, t1, t2, t3, t4, current;

    	var sponsorimage0 = new SponsorImage({
    		props: {
    		href: "https://www.mof.go.th/th/home",
    		src: "./image/sponsor/MOF.png"
    	},
    		$$inline: true
    	});

    	var sponsorimage1 = new SponsorImage({
    		props: {
    		href: "http://www.fpo.go.th",
    		src: "./image/sponsor/FPO.png"
    	},
    		$$inline: true
    	});

    	var sponsorimage2 = new SponsorImage({
    		props: {
    		href: "https://www.cgd.go.th",
    		src: "./image/sponsor/CGD.png"
    	},
    		$$inline: true
    	});

    	var sponsorimage3 = new SponsorImage({
    		props: {
    		href: "https://www.newcb.ktb.co.th",
    		src: "./image/sponsor/Krungthai.png"
    	},
    		$$inline: true
    	});

    	var sponsorimage4 = new SponsorImage({
    		props: {
    		href: "https://www.mots.go.th",
    		src: "./image/sponsor/MOTS.png"
    	},
    		$$inline: true
    	});

    	var sponsorimage5 = new SponsorImage({
    		props: {
    		href: "https://thai.tourismthailand.org",
    		src: "./image/sponsor/TAT.png"
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			sponsorimage0.$$.fragment.c();
    			t0 = space();
    			sponsorimage1.$$.fragment.c();
    			t1 = space();
    			sponsorimage2.$$.fragment.c();
    			t2 = space();
    			sponsorimage3.$$.fragment.c();
    			t3 = space();
    			sponsorimage4.$$.fragment.c();
    			t4 = space();
    			sponsorimage5.$$.fragment.c();
    			attr_dev(div0, "class", "image-container svelte-1c5rt59");
    			add_location(div0, file$7, 25, 2, 562);
    			attr_dev(div1, "class", "sponsor-container svelte-1c5rt59");
    			add_location(div1, file$7, 24, 0, 527);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(sponsorimage0, div0, null);
    			append_dev(div0, t0);
    			mount_component(sponsorimage1, div0, null);
    			append_dev(div0, t1);
    			mount_component(sponsorimage2, div0, null);
    			append_dev(div0, t2);
    			mount_component(sponsorimage3, div0, null);
    			append_dev(div0, t3);
    			mount_component(sponsorimage4, div0, null);
    			append_dev(div0, t4);
    			mount_component(sponsorimage5, div0, null);
    			current = true;
    		},

    		p: noop,

    		i: function intro(local) {
    			if (current) return;
    			transition_in(sponsorimage0.$$.fragment, local);

    			transition_in(sponsorimage1.$$.fragment, local);

    			transition_in(sponsorimage2.$$.fragment, local);

    			transition_in(sponsorimage3.$$.fragment, local);

    			transition_in(sponsorimage4.$$.fragment, local);

    			transition_in(sponsorimage5.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(sponsorimage0.$$.fragment, local);
    			transition_out(sponsorimage1.$$.fragment, local);
    			transition_out(sponsorimage2.$$.fragment, local);
    			transition_out(sponsorimage3.$$.fragment, local);
    			transition_out(sponsorimage4.$$.fragment, local);
    			transition_out(sponsorimage5.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div1);
    			}

    			destroy_component(sponsorimage0);

    			destroy_component(sponsorimage1);

    			destroy_component(sponsorimage2);

    			destroy_component(sponsorimage3);

    			destroy_component(sponsorimage4);

    			destroy_component(sponsorimage5);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$7.name, type: "component", source: "", ctx });
    	return block;
    }

    class Sponsor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$7, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Sponsor", options, id: create_fragment$7.name });
    	}
    }

    /* src\components\sections\information\InfoContent.svelte generated by Svelte v3.12.1 */

    const file$8 = "src\\components\\sections\\information\\InfoContent.svelte";

    function create_fragment$8(ctx) {
    	var div2, div0, t0, t1, div1, current;

    	const default_slot_template = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_template, ctx, null);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(ctx.topic);
    			t1 = space();
    			div1 = element("div");

    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "info-topic svelte-7uwtzr");
    			add_location(div0, file$8, 21, 2, 434);

    			add_location(div1, file$8, 22, 2, 475);
    			attr_dev(div2, "class", "info svelte-7uwtzr");
    			add_location(div2, file$8, 20, 0, 412);
    		},

    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(div1_nodes);
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (!current || changed.topic) {
    				set_data_dev(t0, ctx.topic);
    			}

    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(
    					get_slot_changes(default_slot_template, ctx, changed, null),
    					get_slot_context(default_slot_template, ctx, null)
    				);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div2);
    			}

    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$8.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { topic = '' } = $$props;

    	const writable_props = ['topic'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<InfoContent> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ('topic' in $$props) $$invalidate('topic', topic = $$props.topic);
    		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return { topic };
    	};

    	$$self.$inject_state = $$props => {
    		if ('topic' in $$props) $$invalidate('topic', topic = $$props.topic);
    	};

    	return { topic, $$slots, $$scope };
    }

    class InfoContent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$8, safe_not_equal, ["topic"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "InfoContent", options, id: create_fragment$8.name });
    	}

    	get topic() {
    		throw new Error("<InfoContent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set topic(value) {
    		throw new Error("<InfoContent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\sections\information\Info.svelte generated by Svelte v3.12.1 */

    const file$9 = "src\\components\\sections\\information\\Info.svelte";

    // (53:6) <InfoContent topic="ข้อมูลลงทะเบียนประชาชน">
    function create_default_slot_2(ctx) {
    	var t0, span0, t2, span1, t4, div, t5, a, span2;

    	const block = {
    		c: function create() {
    			t0 = text("การรับสิทธิ การใช้งานแอปพลิเคชั่น\r\n        ");
    			span0 = element("span");
    			span0.textContent = "“เป๋าตัง”";
    			t2 = text("\r\n        และ\r\n        ");
    			span1 = element("span");
    			span1.textContent = "“ถุงเงิน”";
    			t4 = space();
    			div = element("div");
    			t5 = text("ติดต่อ ชิมช้อปใช้ Call Center by Krungthai โทร.\r\n          ");
    			a = element("a");
    			span2 = element("span");
    			span2.textContent = "0 2111 1144";
    			attr_dev(span0, "class", "nowrap");
    			add_location(span0, file$9, 54, 8, 1257);
    			attr_dev(span1, "class", "nowrap");
    			add_location(span1, file$9, 56, 8, 1317);
    			attr_dev(span2, "class", "nowrap");
    			add_location(span2, file$9, 60, 12, 1506);
    			attr_dev(a, "class", "ml-1 svelte-111avza");
    			attr_dev(a, "href", "tel:021111144");
    			add_location(a, file$9, 59, 10, 1455);
    			attr_dev(div, "class", "detail");
    			add_location(div, file$9, 57, 8, 1364);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, span0, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, span1, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t5);
    			append_dev(div, a);
    			append_dev(a, span2);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t0);
    				detach_dev(span0);
    				detach_dev(t2);
    				detach_dev(span1);
    				detach_dev(t4);
    				detach_dev(div);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot_2.name, type: "slot", source: "(53:6) <InfoContent topic=\"ข้อมูลลงทะเบียนประชาชน\">", ctx });
    	return block;
    }

    // (67:6) <InfoContent topic="ข้อมูลลงทะเบียนผู้ประกอบการ">
    function create_default_slot_1(ctx) {
    	var div0, t1, div1, t2, a, span;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "เงื่อนไขและวิธีการเข้าร่วมมาตรการฯ";
    			t1 = space();
    			div1 = element("div");
    			t2 = text("ติดต่อ โทร.\r\n          ");
    			a = element("a");
    			span = element("span");
    			span.textContent = "0 2270 6400 กด 7";
    			add_location(div0, file$9, 67, 8, 1702);
    			attr_dev(span, "class", "nowrap");
    			add_location(span, file$9, 71, 12, 1835);
    			attr_dev(a, "href", "tel:022706400");
    			attr_dev(a, "class", "svelte-111avza");
    			add_location(a, file$9, 70, 10, 1797);
    			add_location(div1, file$9, 68, 8, 1757);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t2);
    			append_dev(div1, a);
    			append_dev(a, span);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div0);
    				detach_dev(t1);
    				detach_dev(div1);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot_1.name, type: "slot", source: "(67:6) <InfoContent topic=\"ข้อมูลลงทะเบียนผู้ประกอบการ\">", ctx });
    	return block;
    }

    // (78:6) <InfoContent topic="ข้อมูลเที่ยวชิมช้อปใช้">
    function create_default_slot(ctx) {
    	var div0, t1, div1, t2, a, span;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "ติดต่อ ททท.";
    			t1 = space();
    			div1 = element("div");
    			t2 = text("โทร\r\n          ");
    			a = element("a");
    			span = element("span");
    			span.textContent = "1672";
    			add_location(div0, file$9, 78, 8, 2031);
    			add_location(span, file$9, 82, 12, 2128);
    			attr_dev(a, "href", "tel:1672");
    			attr_dev(a, "class", "svelte-111avza");
    			add_location(a, file$9, 81, 10, 2095);
    			add_location(div1, file$9, 79, 8, 2063);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t2);
    			append_dev(div1, a);
    			append_dev(a, span);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div0);
    				detach_dev(t1);
    				detach_dev(div1);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot.name, type: "slot", source: "(78:6) <InfoContent topic=\"ข้อมูลเที่ยวชิมช้อปใช้\">", ctx });
    	return block;
    }

    function create_fragment$9(ctx) {
    	var div5, div4, div0, img, t0, div1, t1, div2, t2, div3, current;

    	var infocontent0 = new InfoContent({
    		props: {
    		topic: "ข้อมูลลงทะเบียนประชาชน",
    		$$slots: { default: [create_default_slot_2] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	var infocontent1 = new InfoContent({
    		props: {
    		topic: "ข้อมูลลงทะเบียนผู้ประกอบการ",
    		$$slots: { default: [create_default_slot_1] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	var infocontent2 = new InfoContent({
    		props: {
    		topic: "ข้อมูลเที่ยวชิมช้อปใช้",
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			infocontent0.$$.fragment.c();
    			t1 = space();
    			div2 = element("div");
    			infocontent1.$$.fragment.c();
    			t2 = space();
    			div3 = element("div");
    			infocontent2.$$.fragment.c();
    			attr_dev(img, "class", "item-image svelte-111avza");
    			attr_dev(img, "src", "./image/information-logo.png");
    			attr_dev(img, "alt", "information-logo");
    			add_location(img, file$9, 46, 6, 1005);
    			attr_dev(div0, "class", "item svelte-111avza");
    			add_location(div0, file$9, 45, 4, 979);
    			attr_dev(div1, "class", "item svelte-111avza");
    			add_location(div1, file$9, 51, 4, 1134);
    			attr_dev(div2, "class", "item svelte-111avza");
    			add_location(div2, file$9, 65, 4, 1617);
    			attr_dev(div3, "class", "item svelte-111avza");
    			add_location(div3, file$9, 76, 4, 1951);
    			attr_dev(div4, "class", "item-container svelte-111avza");
    			add_location(div4, file$9, 44, 2, 945);
    			attr_dev(div5, "class", "info-container svelte-111avza");
    			add_location(div5, file$9, 43, 0, 913);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div0);
    			append_dev(div0, img);
    			append_dev(div4, t0);
    			append_dev(div4, div1);
    			mount_component(infocontent0, div1, null);
    			append_dev(div4, t1);
    			append_dev(div4, div2);
    			mount_component(infocontent1, div2, null);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			mount_component(infocontent2, div3, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var infocontent0_changes = {};
    			if (changed.$$scope) infocontent0_changes.$$scope = { changed, ctx };
    			infocontent0.$set(infocontent0_changes);

    			var infocontent1_changes = {};
    			if (changed.$$scope) infocontent1_changes.$$scope = { changed, ctx };
    			infocontent1.$set(infocontent1_changes);

    			var infocontent2_changes = {};
    			if (changed.$$scope) infocontent2_changes.$$scope = { changed, ctx };
    			infocontent2.$set(infocontent2_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(infocontent0.$$.fragment, local);

    			transition_in(infocontent1.$$.fragment, local);

    			transition_in(infocontent2.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(infocontent0.$$.fragment, local);
    			transition_out(infocontent1.$$.fragment, local);
    			transition_out(infocontent2.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div5);
    			}

    			destroy_component(infocontent0);

    			destroy_component(infocontent1);

    			destroy_component(infocontent2);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$9.name, type: "component", source: "", ctx });
    	return block;
    }

    class Info extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$9, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Info", options, id: create_fragment$9.name });
    	}
    }

    /* src\components\sections\Footer.svelte generated by Svelte v3.12.1 */

    const file$a = "src\\components\\sections\\Footer.svelte";

    function create_fragment$a(ctx) {
    	var div, ul, li0, t1, li1, a0, t3, li2, a1, t5, li3, a2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "Copyright © 2003-2019";
    			t1 = space();
    			li1 = element("li");
    			a0 = element("a");
    			a0.textContent = "ลงทะเบียนเข้าร่วมมาตรการ";
    			t3 = space();
    			li2 = element("li");
    			a1 = element("a");
    			a1.textContent = "ขั้นตอนการเข้าร่วมทั้งหมด";
    			t5 = space();
    			li3 = element("li");
    			a2 = element("a");
    			a2.textContent = "รายชื่อร้านค้าที่เข้าร่วมรายการ";
    			attr_dev(li0, "id", "copyright");
    			attr_dev(li0, "class", "svelte-1bbp6ky");
    			add_location(li0, file$a, 44, 4, 945);
    			attr_dev(a0, "href", "https://regist.xn--b3caa1e2a7e2b0h2be.com/Register/");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "class", "svelte-1bbp6ky");
    			add_location(a0, file$a, 46, 6, 1008);
    			attr_dev(li1, "class", "svelte-1bbp6ky");
    			add_location(li1, file$a, 45, 4, 996);
    			attr_dev(a1, "href", "https://www2.xn--b3caa1e2a7e2b0h2be.com/howto-register");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "class", "svelte-1bbp6ky");
    			add_location(a1, file$a, 53, 6, 1179);
    			attr_dev(li2, "class", "svelte-1bbp6ky");
    			add_location(li2, file$a, 52, 4, 1167);
    			attr_dev(a2, "href", "https://www2.xn--b3caa1e2a7e2b0h2be.com/thung-ngern-shop-province");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "class", "svelte-1bbp6ky");
    			add_location(a2, file$a, 60, 6, 1354);
    			attr_dev(li3, "class", "svelte-1bbp6ky");
    			add_location(li3, file$a, 59, 4, 1342);
    			attr_dev(ul, "class", "link-container svelte-1bbp6ky");
    			add_location(ul, file$a, 43, 2, 912);
    			attr_dev(div, "class", "footer-container svelte-1bbp6ky");
    			add_location(div, file$a, 42, 0, 878);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(li1, a0);
    			append_dev(ul, t3);
    			append_dev(ul, li2);
    			append_dev(li2, a1);
    			append_dev(ul, t5);
    			append_dev(ul, li3);
    			append_dev(li3, a2);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$a.name, type: "component", source: "", ctx });
    	return block;
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$a, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Footer", options, id: create_fragment$a.name });
    	}
    }

    /* src\App.svelte generated by Svelte v3.12.1 */

    const file$b = "src\\App.svelte";

    function create_fragment$b(ctx) {
    	var t0, div, t1, t2, t3, t4, t5, footer1, t6, current;

    	var navbar = new Navbar({
    		props: { items: ctx.apiData.navbarItems },
    		$$inline: true
    	});

    	var banner = new Banner({ $$inline: true });

    	var announcement = new Announcement({
    		props: { duration: ctx.apiData.duration },
    		$$inline: true
    	});

    	var about = new About({
    		props: {
    		detail: ctx.apiData.detail,
    		condition: ctx.apiData.condition
    	},
    		$$inline: true
    	});

    	var contact = new Contact({ $$inline: true });

    	var sponsor = new Sponsor({ $$inline: true });

    	var info = new Info({ $$inline: true });

    	var footer0 = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			navbar.$$.fragment.c();
    			t0 = space();
    			div = element("div");
    			banner.$$.fragment.c();
    			t1 = space();
    			announcement.$$.fragment.c();
    			t2 = space();
    			about.$$.fragment.c();
    			t3 = space();
    			contact.$$.fragment.c();
    			t4 = space();
    			sponsor.$$.fragment.c();
    			t5 = space();
    			footer1 = element("footer");
    			info.$$.fragment.c();
    			t6 = space();
    			footer0.$$.fragment.c();
    			add_location(footer1, file$b, 31, 2, 1070);
    			attr_dev(div, "class", "content svelte-nrg8zm");
    			add_location(div, file$b, 25, 0, 892);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(banner, div, null);
    			append_dev(div, t1);
    			mount_component(announcement, div, null);
    			append_dev(div, t2);
    			mount_component(about, div, null);
    			append_dev(div, t3);
    			mount_component(contact, div, null);
    			append_dev(div, t4);
    			mount_component(sponsor, div, null);
    			append_dev(div, t5);
    			append_dev(div, footer1);
    			mount_component(info, footer1, null);
    			append_dev(footer1, t6);
    			mount_component(footer0, footer1, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var navbar_changes = {};
    			if (changed.apiData) navbar_changes.items = ctx.apiData.navbarItems;
    			navbar.$set(navbar_changes);

    			var announcement_changes = {};
    			if (changed.apiData) announcement_changes.duration = ctx.apiData.duration;
    			announcement.$set(announcement_changes);

    			var about_changes = {};
    			if (changed.apiData) about_changes.detail = ctx.apiData.detail;
    			if (changed.apiData) about_changes.condition = ctx.apiData.condition;
    			about.$set(about_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);

    			transition_in(banner.$$.fragment, local);

    			transition_in(announcement.$$.fragment, local);

    			transition_in(about.$$.fragment, local);

    			transition_in(contact.$$.fragment, local);

    			transition_in(sponsor.$$.fragment, local);

    			transition_in(info.$$.fragment, local);

    			transition_in(footer0.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(banner.$$.fragment, local);
    			transition_out(announcement.$$.fragment, local);
    			transition_out(about.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			transition_out(sponsor.$$.fragment, local);
    			transition_out(info.$$.fragment, local);
    			transition_out(footer0.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);

    			if (detaching) {
    				detach_dev(t0);
    				detach_dev(div);
    			}

    			destroy_component(banner);

    			destroy_component(announcement);

    			destroy_component(about);

    			destroy_component(contact);

    			destroy_component(sponsor);

    			destroy_component(info);

    			destroy_component(footer0);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$b.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	
      let apiData = {};
      onMount(() => {
        fetch('https://panjs.com/ywc.json')
          .then(response => response.json())
          .then(result => ($$invalidate('apiData', apiData = result)));
      });
      let { name } = $$props;

    	const writable_props = ['name'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('name' in $$props) $$invalidate('name', name = $$props.name);
    	};

    	$$self.$capture_state = () => {
    		return { apiData, name };
    	};

    	$$self.$inject_state = $$props => {
    		if ('apiData' in $$props) $$invalidate('apiData', apiData = $$props.apiData);
    		if ('name' in $$props) $$invalidate('name', name = $$props.name);
    	};

    	return { apiData, name };
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$b, safe_not_equal, ["name"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "App", options, id: create_fragment$b.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.name === undefined && !('name' in props)) {
    			console.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
