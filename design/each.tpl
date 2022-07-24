<h1>Shopping list</h1>
<ul>
	{#each props.items as item, i}
		<li>{i} {item.name} x {item.qty}</li>
	{/each}
</ul>