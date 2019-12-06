import React from 'react';

import { List, Grid, Button, Menu, MenuItem, Popper } from '@material-ui/core';
import ContainerTreeItem from '../container/ContainerTreeItem';

// import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";


type ClientPosition = number | null;
interface Props {
    firstDepth: any[],
    realMap: Map<any, any>,
    selectedKey: string,
    setSelectedKey(selectedKey: string): void,
    handleDelete(): void,
    contextMenu(e: React.MouseEvent<HTMLDivElement>): void,
    popupOpen: boolean,
    setPopupOpen(b: boolean): void,
    clientX: ClientPosition,
    clientY: ClientPosition,
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
                        contextMenu={(e: React.MouseEvent<HTMLDivElement>) => props.contextMenu(e)}
                    />
                )
            })
        }
    }, [props])

    return (
        <>
            <Menu
                anchorReference='anchorPosition'
                anchorPosition={
                    props.clientX !== null && props.clientY !== null
                        ? { top: props.clientY, left: props.clientX }
                        : undefined
                }
                open={props.popupOpen}
                onClose={() => props.setPopupOpen(!props.popupOpen)}
            >
                <MenuItem >삭제</MenuItem>
                <MenuItem >수정</MenuItem>
                <MenuItem >추가</MenuItem>
            </Menu>

            {/* <ContextMenu id="some_unique_identifier">
                <MenuItem >
                    ContextMenu Item 1
                </MenuItem>
                <MenuItem >
                    ContextMenu Item 2
                </MenuItem>
                <MenuItem divider />
                <MenuItem  >
                    ContextMenu Item 3
                </MenuItem>
            </ContextMenu> */}
            <Grid container item xs={12}>
                <Grid item xs={12}>
                    <List component='nav'>
                        {treeItem}
                    </List>
                </Grid>

            </Grid>
            {/* <Grid item xs={4}>
                <Button color='primary' onClick={props.handleDelete}>삭제</Button>
            </Grid>
            <Grid item xs={4}>
                <Button color='primary'>수정</Button>
            </Grid>
            <Grid item xs={4}>
                <Button color='primary'>추가</Button>
            </Grid> */}

        </>

    );
}

export default PresentationalTreeView;