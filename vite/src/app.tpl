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
        initState: (props) => {
            return new Promise((resolve) => {
                setTimeout(() => resolve({ count: 1000 }), 1000)
            })
        }
    }
</script>

<Tpl:el @register="counter" count={state.count} />
<Tpl:btn @trigger:submit="counter" />