<script>
    import "antd/dist/antd.css"
    import { Button } from 'antd'

    function handleClick({ $trigger, count }) {
        $trigger('change', { count })
    }
</script>

<Button onClick={() => handleClick({$trigger, count: 1})}>count + 1</Button>
<Button onClick={() => handleClick({$trigger, count: -1})}>count - 1</Button>