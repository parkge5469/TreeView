import React from 'react'
import TreeMap from 'ts-treemap';

//ICON
import PresentationalTreeItem from '../presentational/PresentationalTreeItem';

interface Props {
    isChild: boolean,
    label: string,
    icon?: any,
    data: Map<any, any>,
    spacing?: number,
    selectKey: string,
    selectedKey: string,
    setSelectedKey(selectKey: string): void,
    contextMenu(e: React.MouseEvent<HTMLDivElement>): void,
}


const ContainerTreeItem = (props: Props) => {
    const [open, setOpen] = React.useState(false);
    const [spacing, setSpacing] = React.useState(0);

    React.useMemo(() => {
        if (props.spacing) {
            setSpacing(props.spacing);
        }

    }, [props.spacing])

    const handleClick = React.useCallback(() => {
        setOpen(!open);
        props.setSelectedKey(props.selectKey);
    }, [open, props])

    const childItem = React.useCallback(() => {
        let treeMap = TreeMap.fromMap(props.data);
        let parentData = treeMap.get(props.label);
        let childArray = [...parentData.children];
        let isChild = true;

        return childArray.map((v, i) => {
            if (0 === treeMap.get(v).children.length) {
                isChild = false;
            } else {
                isChild = true;
            }
            return (
                <ContainerTreeItem
                    key={i}
                    data={props.data}
                    isChild={isChild}
                    label={v}
                    spacing={spacing + 4}
                    setSelectedKey={(s: string) => props.setSelectedKey(s)}
                    selectedKey={props.selectedKey}
                    selectKey={v}
                    contextMenu={(e: React.MouseEvent<HTMLDivElement>) => props.contextMenu(e)}
                />
            )
        })
    }, [props])
    return (
        <React.Fragment>
            <PresentationalTreeItem
                spacing={spacing}
                selectedKey={props.selectedKey}
                selectKey={props.selectKey}
                label={props.label}
                isChild={props.isChild}
                open={open}
                handleClick={() => handleClick()}
                childItem={() => childItem()}
                contextMenu={(e: React.MouseEvent<HTMLDivElement>) => props.contextMenu(e)}
            />
        </React.Fragment>
    );
}



export default ContainerTreeItem;