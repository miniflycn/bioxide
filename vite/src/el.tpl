<script>
    import "./el.css"

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

<p class="test">{props.msg}: {state.count}</p>