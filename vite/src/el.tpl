<script>
    export default {
        defaultState: { count: 0 },
        register: {
            change: (payload, { setState, state }) => {
                if (payload.count) {
                    setState({ count: state.count + payload.count })
                }
            } 
        }
    }
</script>

<p>{props.msg}: {state.count}</p>