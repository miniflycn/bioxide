{#if props.type !== 'a'}
    <p>hello {props.msg}</p>
{/if}

{#if props.type == 'a'}
    <p>I am a</p>
{:else if props.type == 'b'}
    <p>I am b</p>
{:else}
    <p>I am c</p>
{/if}