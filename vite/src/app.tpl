<script>
    export default {
        initState: function () {
            return new Promise((resolve) => {
                resolve({
                    msg: 'hello world'
                })
            })
        }
    }
</script>

<p onClick={() => setStatexxx({ msg: 'lalala' })}>{state.msg}</p>