<script>
    export default {
        // defaultState is not exist
        // initState nothing todo
        initState: () => {
            return new Promise(() => {})
        }
    }
</script>

<!-- 理论上这个会挂，但系统会根据模版的写法注入默认state -->
<p>{state.obj.msg}</p>

<!-- 下面这个写法会挂
没有<script>标签，但模版里面使用了state，因为没有<script>理论上是纯函数模版，
但却用了state，这是错误的，系统会提示

<p>{state.obj.msg}</p>
-->