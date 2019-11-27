import React from 'react';

import { List, Grid, Button } from '@material-ui/core';
import ContainerTreeItem from '../container/ContainerTreeItem';


interface Props {
    firstDepth: any[],
    realMap: Map<any, any>,
    selectedKey: string,
    setSelectedKey(selectedKey: string): void,
    handleDelete(): void,
}

const PresentationalTreeView = (props: Props) => {


    React.useEffect(() => {
        console.log(props.realMap)
    })


    const treeItem = React.useMemo(() => {
        console.log('re')
        let isChild = true;
        if (1 < props.firstDepth.length) {
            return props.firstDepth.map((v: any, i: number) => {
                if (0 === v.children.length) {
                    isChild = false;
                }
                return (
                    <ContainerTreeItem
                        key={i}
                        data={props.realMap}
                        isChild={isChild}
                        label={v.group_name}
                        selectedKey={props.selectedKey}
                        setSelectedKey={(s: string) => props.setSelectedKey(s)}
                        selectKey={v.group_name}
                    />
                )
            })
        }
    }, [props])

    return (
        <Grid container>
            <Grid item xs={12}>
                <List component='nav'>
                    {treeItem}
                </List>
            </Grid>
            <Grid item xs={4}>
                <Button onClick={props.handleDelete}>삭제</Button>
            </Grid>
            <Grid item xs={4}>
                <Button>수정</Button>
            </Grid>
            <Grid item xs={4}>
                <Button>추가</Button>
            </Grid>
        </Grid>

    );
}

export default PresentationalTreeView;