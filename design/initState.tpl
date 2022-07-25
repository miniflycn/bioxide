<script>
    export default {
        initState: function (props) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve({
                        loading: true
                    })
                }, 10)
            })
        }
    }
</script>

{#if state.loading}
<p>i am loading</p>
{:else}
<p>i am not loading</p>
{/if}