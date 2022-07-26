<script>
    export default {
        defaultState: { count: 0 }
        register: {
            change: (payload, { state, setState }) => {
                if (payload.count) {
                    setState({ count: state.count + payload.count })
                }
            } 
        }
    }
</script>

<p>{props.msg}: {state.count}</p>