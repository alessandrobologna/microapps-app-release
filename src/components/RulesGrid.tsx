import styles from '../styles/AppGrid.module.css';
import { Grid } from 'react-virtualized';
import React from 'react';
import clsx from 'clsx';
import { IRule } from '@pwrdrvr/microapps-datalib/dist/models/rules';

interface IFlatRule {
  key: string;
  rule: IRule;
}

export interface IRules {
  AppName: string;
  RuleSet: IFlatRule[];
}

interface IPageProps {
  rules: IRules;
  height: number;
  width: number;
}

interface IPageState {
  columnCount: number;
  rowHeight: number;
  rowCount: number;
  rules: IRules;
}

export default class RulesGrid extends React.PureComponent<IPageProps, IPageState> {
  constructor(props: IPageProps) {
    super(props);

    this.state = {
      columnCount: 5,
      rowHeight: 40,
      rowCount: this.props.rules.RuleSet.length,
      rules: this.props.rules,
    };

    this._cellRenderer = this._cellRenderer.bind(this);
    this._getRowClassName = this._getRowClassName.bind(this);
    this._noContentRenderer = this._noContentRenderer.bind(this);
    this._renderBodyCell = this._renderBodyCell.bind(this);
    this._renderLeftSideCell = this._renderLeftSideCell.bind(this);
  }

  render(): JSX.Element {
    const { columnCount, rowHeight, rowCount } = this.state;

    return (
      <Grid
        cellRenderer={this._cellRenderer}
        className={styles.BodyGrid}
        columnWidth={this._getColumnWidth}
        columnCount={columnCount}
        height={this.props.height}
        noContentRenderer={this._noContentRenderer}
        overscanColumnCount={0}
        overscanRowCount={10}
        rowHeight={rowHeight}
        rowCount={rowCount}
        width={this.props.width}
      />
    );
  }

  _cellRenderer({
    columnIndex,
    key,
    rowIndex,
    style,
  }: {
    columnIndex: number;
    key: string;
    rowIndex: number;
    style: React.CSSProperties;
  }): JSX.Element {
    if (columnIndex === 0) {
      return this._renderLeftSideCell({ key, rowIndex, style });
    } else {
      return this._renderBodyCell({ columnIndex, key, rowIndex, style });
    }
  }

  _getColumnWidth({ index }: { index: number }): number {
    switch (index) {
      case 0:
        return 50;
      case 1:
        return 100;
      case 2:
        return 100;
      case 3:
        return 100;
      case 4:
        return 100;
      default:
        return 80;
    }
  }

  _getDatum(index: number): IFlatRule {
    const { rules } = this.state;

    return rules.RuleSet[index];
  }

  _getRowClassName(row: number): string {
    return row % 2 === 0 ? styles.evenRow : styles.oddRow;
  }

  _getRowHeight({ index }: { index: number }): number {
    //return this._getDatum(index).size;
    return 40;
  }

  _noContentRenderer(): JSX.Element {
    return <div className={styles.noCells}>No cells</div>;
  }

  _renderBodyCell({
    columnIndex,
    key,
    rowIndex,
    style,
  }: {
    columnIndex: number;
    key: string;
    rowIndex: number;
    style: React.CSSProperties;
  }): JSX.Element {
    const rowClass = this._getRowClassName(rowIndex);
    const datum = this._getDatum(rowIndex);

    let content;

    switch (columnIndex) {
      case 1:
        content = datum.key;
        break;
      case 2:
        content = datum.rule.AttributeName;
        break;
      case 3:
        content = datum.rule.AttributeValue;
        break;
      case 4:
        content = datum.rule.SemVer;
        break;
      default:
        content = `r:${rowIndex}, c:${columnIndex}`;
        break;
    }

    const classNames = clsx(rowClass, styles.cell, {
      [styles.centeredCell]: columnIndex > 5,
    });

    return (
      <div className={classNames} key={key} style={style}>
        {content}
      </div>
    );
  }

  _renderLeftSideCell({
    key,
    rowIndex,
    style,
  }: {
    key: string;
    rowIndex: number;
    style: React.CSSProperties;
  }): JSX.Element {
    const datum = this._getDatum(rowIndex);

    const classNames = clsx(styles.cell, styles.letterCell);

    // Don't modify styles.
    // These are frozen by React now (as of 16.0.0).
    // Since Grid caches and re-uses them, they aren't safe to modify.
    style = {
      ...style,
      backgroundColor: 'orange',
    };

    return (
      <div className={classNames} key={key} style={style}>
        {datum.key.charAt(0)}
      </div>
    );
  }
}
