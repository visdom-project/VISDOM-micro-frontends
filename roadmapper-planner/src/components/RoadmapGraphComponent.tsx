import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { StarFill, Wrench, List } from "react-bootstrap-icons";
import { PublicUser, Roadmap, Version } from "../types";
import { totalValueAndWork } from "../utils";
import { TaskValueComponent } from "./TaskValueComponent";
import css from "./RoadmapGraphComponent.module.scss";

const classes = classNames.bind(css);

export const RoadmapGraphComponent: React.FC<{
  versions: Version[];
  roadmap: Roadmap;
  publicUsers: PublicUser[];
}> = ({ versions, roadmap, publicUsers }) => {
  const [selectedVersion, setSelectedVersion] = useState<undefined | Version>(
    undefined
  );

  useEffect(() => {
    if (selectedVersion === undefined && versions && versions[0]) {
      setSelectedVersion(versions[0]);
    }
  }, [versions, selectedVersion]);

  return (
    <>
      <div className={classes(css.graphOuter)}>
        <p className={classes(css.graphTitle)}>Value / Work</p>
        <div className={classes(css.graphInner)}>
          <div className={classes(css.graphItems)}>
            {roadmap &&
              versions &&
              versions?.map((ver) => {
                const numTasks = ver.tasks.length;
                const { value, work } = totalValueAndWork(ver.tasks);

                const w = Math.max(100, 60 * (work / 5));
                const h = Math.max(90, 50 * (value / 5));
                return (
                  <div
                    className={classes(css.graphItem, {
                      [css.selected]: ver.id === selectedVersion?.id,
                    })}
                    style={{ width: `${w}px`, height: `${h}px` }}
                    key={ver.id}
                    onClick={() => setSelectedVersion(ver)}
                    onKeyPress={() => setSelectedVersion(ver)}
                    role="button"
                    tabIndex={0}
                  >
                    <p className={classes(css.versionData, css.versionTitle)}>
                      {ver.name}
                    </p>
                    <p className={classes(css.versionData)}>
                      <StarFill />
                      {value.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 1,
                      })}
                    </p>
                    <p className={classes(css.versionData)}>
                      <Wrench />
                      {work.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 1,
                      })}
                    </p>
                    <p className={classes(css.versionData)}>
                      <List />
                      {numTasks}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
        <p>Total work</p>
      </div>

      <div className={classes(css.footer)}>
        <p className={classes(css.graphTitle)}>Customers stakes in milestone</p>
        {selectedVersion && roadmap && publicUsers && (
          <TaskValueComponent
            version={selectedVersion}
            roadmap={roadmap}
            publicUsers={publicUsers}
          />
        )}
      </div>
    </>
  );
};
