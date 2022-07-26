<script>
    import "antd/dist/antd.css"
    import { Button } from 'antd'

    function handleClick({state, setState, count}){
        setState({
            count: state.count + count
        }, () => {
            console.log('hello world')
        });
    }

    export default {
        defaultState: { count: 0 },
        initState: () => {
            return new Promise((resolve) => {
                setTimeout(() => resolve({ count: 1000 }), 1000)
            })
        }
    }
</script>

<Tpl:el count={state.count}></Tpl:el>
<Button onClick={() => handleClick({state, setState, count: 1})}>count + 1</Button>
<Button onClick={() => handleClick({state, setState, count: -1})}>count - 1</Button>