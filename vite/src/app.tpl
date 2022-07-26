<script>
    import "antd/dist/antd.css"
    import { Button } from 'antd'

    function handleClick({state, setState, count}){
        setState({
            ...state,
            count: state.count + count
        });
    }

    export default {
        defaultState: { count: 0 },
    }
</script>

<Tpl:el count={state.count}></Tpl:el>
<Button onClick={() => handleClick({state, setState, count: 1})}>count + 1</Button>
<Button onClick={() => handleClick({state, setState, count: -1})}>count - 1</Button>