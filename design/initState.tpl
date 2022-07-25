<script>
    fucntion reducer(state, action) {
        switch (action.type) {
            case 'GET'
                return {}
        }
    }

    export default {
        initState: function (props) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve({
                        loading: true
                    })
                }, 100)
            })
        },
        reducer: reducer
    }
</script>

{#if state.loading}
<p>i am loading</p>
{:else}
<p>i am not loading</p>
{/if}