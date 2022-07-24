<script>
    function reducer(state, action) {
        return state
    }
    export default {
        defaultState: {},
        initState: new Promise((resolve) => { resolve({}) }),
        reducer,
    }
</script>

{#if props.obj.type !== 'hello'}
    <p>hello {props.obj.msg}</p>
    <p>{state.msg}</p>
    <p>{state.obj.msg}</p>
    <p>{state.obj.type}</p>
{/if}

{#if props.type == 'a'}
    <p>I am a</p>
{:else if props.type == 'b'}
    <p>I am b</p>
{:else}
    <p>I am c</p>
{/if}