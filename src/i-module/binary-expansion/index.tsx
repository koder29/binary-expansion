import React, { useState } from 'react';
import '../binary-expansion/style.css'
import { v4 as uuidv4 } from 'uuid';

const Latex = require('react-latex');
type Nullable<T> = T | null | undefined;

const colors =
    ['#1F8BF6',
        '#FD3462',
        '#D2A88F',
        '#770AF5',
        '#F4FE5C',
        '#8F5CDD',
        '#967ACB',
        '#377558',
        '#F9B0C5',
        '#55980C'];

export class LinkedListTreeNode<T> {
    private next: Nullable<Array<LinkedListTreeNode<T>>>;
    constructor(private value: T) { };


    addNext(nextValue: T) {
        if (!this.next) {
            this.next = [];
        }
        this.next.push(new LinkedListTreeNode(nextValue));
        return this.next;
    }
}

function multiply(a: any, b: any) {
    return {
        value: `${a.value}${b.value}`,
        id: uuidv4(),
        parent: a.id
    }

}

function recursiveTick<T>(growths: Array<any>) {
    let newArray = []
    for (let term of growths) {
        newArray.push(term);
        newArray.push(multiply(term, { value: 'a', id: uuidv4() }))
        newArray.push(multiply(term, { value: 'b', id: uuidv4() }))

    }
    return newArray;
}

type Datum = { id: string, parent: string, value: string, selected: boolean, selectionColor: string }
function selectChildren(selectedId: string, data: Array<Datum>, color: string) {
    const family = new Set<string>();
    return data.map(data => {
        if (selectedId === data.parent || (family.has(data.parent) && false)) {
            family.add(data.id);
            return { ...data, selected: true, selectionColor: color }
        } else return { ...data }
    })
}

function reset(data: Array<Datum>) {
    return data.map(dataum => ({
        ...dataum,
        selected: false
    }));

}

function handleClicks(event: MouseEvent, data: Array<Datum>, details: { value: string, id: string }, color: string, selectionCount?: number) {
    if (event.ctrlKey) {
        return selectSimilar(details.value, data, color, selectionCount ?? 0);
    } else if (event.shiftKey) {
        return selectParentOfSimilar(details.value, data, selectionCount ?? 0);
    } else if (event.altKey) {
        return selectExact(details.value, data, selectionCount ?? 0);
    }
    else {
        return selectChildren(details.id, data, color);
    }
}

export function BinaryExpansion(props: { power: number }) {

    const [generations, setGenerations] = useState<Array<any>>([{ id: uuidv4(), value: '1', selected: false, parent: '' }]);
    const [ticks, setTicks] = useState<number>(0);
    const [selectionColor, setSelectionColor] = useState(colors[0]);
    const [unSelectionColor, setUnSelectionColor] = useState('#000000');
    const [parents, setParents] = useState<Set<string>>(new Set());
    const [count, setCount] = useState<number>(0);

    return <div>
        <div>
            <input value={selectionColor} onChange={e => setSelectionColor(e.target.value)} />
        </div>
        <div>
            <input value={unSelectionColor} onChange={e => setUnSelectionColor(e.target.value)} />
        </div>
        <div>
            <button onClick={e => {
                setGenerations(recursiveTick(generations));
                setTicks(ticks + 1);
            }}>Tick</button>

            <button onClick={e => {
                setGenerations([{ value: '1', selected: false, id: uuidv4(), parent: '' }]);
                setParents(new Set());
                setTicks(0);
                setCount(0);
            }}>Reset</button>

            <button onClick={e => {
                setGenerations(reset(generations));

            }}>Reset Selection alone</button>
        </div>
        <div>
            <h5>
                Generators - {ticks}
            </h5>
        </div>
        <div>
            {
                new Array(...parents.values()).map(value => {
                    return <span
                        style={{ marginRight: '1rem', marginBottom: '2rem', borderBottom: ' 1px solid grey' }}
                    >
                        {value}
                    </span>
                })
            }
        </div>

        <section>

            {
                generations.map((term, idx) => {
                    return (
                        <span
                            data-parent={term.parent}
                            data-id={term.id}
                            onClick={e => {
                                if (e.shiftKey) {
                                    const [selectedParents, uniqList] = handleClicks(e as any as MouseEvent, generations, term, selectionColor, count + 1);
                                    setGenerations(selectedParents as Array<Datum>);
                                    setParents(uniqList as Set<string>);
                                    setCount(count + 1)

                                } else if (e.altKey) {
                                    setGenerations(handleClicks(e as any as MouseEvent, generations, term, selectionColor, count));
                                    setCount(count + 1)
                                }
                                else {
                                    setGenerations(handleClicks(e as any as MouseEvent, generations, term, selectionColor, count + 1));
                                    setCount(count + 1)

                                }
                            }}
                            style={{ marginRight: '1rem', marginBottom: '2rem', borderBottom: ' 1px solid grey', color: term.selected ? term.selectionColor : unSelectionColor }}
                            key={`${term.value}${idx}`}>
                            {term.value}
                        </span>
                    )
                })
            }
        </section>
    </div>
}

function selectSimilar(value: string, data: Array<Datum>, color: string, count: number) {
    debugger
    return data.map(term => {
        if (term.value.split('').sort().join('') === value.split('').sort().join('')) {
            return {
                ...term,
                selectionColor: colors[count],
                selected: true
            }
        } else {
            return { ...term };
        }
    })
}

function selectParentOfSimilar(value: string, data: Array<Datum>, count: number) {
    const valueSorted = value.split('').sort().join('');

    const toBeSelectedParents = new Set<string>(data.filter(datum => {
        return datum.value.split('').sort().join('') === valueSorted;
    }).map(term => term.parent));

    const selectedParents = data.map(datum => {
        return {
            ...datum,
            selectionColor: datum.selected ? datum.selectionColor : (toBeSelectedParents.has(datum.id) && colors[count]),
            selected: datum.selected || toBeSelectedParents.has(datum.id),
        }
    });
    return [selectedParents, new Set(selectedParents.filter(datum => datum.selected).map(term => term.value))]

}

function selectExact(value: string, data: Array<Datum>, selectionCount: number) {
    debugger
    return data.map(datum => {
        return {
            ...datum,
            selectionColor: datum.selected ? datum.selectionColor : colors[selectionCount],
            selected: datum.value === value || datum.selected,
        }
    })
}

function poorColorGenerator(length: number) {
    const colors = new Array(length);
    let startColor = 0x110000
    for (let i = 0; i < length; i++) {
        colors[i] = `#${Number(startColor).toString(16)}`;
        startColor += 0x000900;
    }

    return colors;
}
