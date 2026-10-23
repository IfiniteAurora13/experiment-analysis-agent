window.EXPERIMENT_REVIEW_DATA = {
  "mode": "synthetic_python_replay",
  "engine_version": "bundle-review-v1",
  "scenarios": [
    {
      "id": "clean",
      "name": "正常评审",
      "description": "先检查原始数据，再确认口径，最后查看收益与风险。",
      "inspection": {
        "status": "NEEDS_CONFIRMATION",
        "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
        "inspection": {
          "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
          "valid": true,
          "contract": {
            "schema_version": 1,
            "experiment_id": "synthetic-detail-page-001",
            "objective": "提升详情页 7 天支付转化率，同时限制每用户支付 GMV 损失",
            "randomization_unit": "user",
            "expected_control_ratio": 0.5,
            "enrollment_start": "2026-09-01T00:00:00+08:00",
            "enrollment_end": "2026-09-08T00:00:00+08:00",
            "observation_days": 7,
            "timezone": "Asia/Shanghai",
            "currency": "CNY",
            "conversion_event": "paid_order",
            "denominator": "all_assigned_users",
            "zero_policy": "after_watermark_only",
            "refunds": "not_deducted",
            "alpha": 0.05,
            "analysis_mode": "fixed_horizon",
            "policy": {
              "intent": "conversion_guarded",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "manifest": {
            "snapshot_at": "2026-09-16T12:00:00+08:00",
            "assignments_complete_through": "2026-09-08T00:00:00+08:00",
            "orders_complete_through": "2026-09-15T00:00:00+08:00",
            "source_evidence": "SYNTHETIC-WATERMARK-001：仅用于验证数据规则的合成完整性声明",
            "origin": "synthetic"
          },
          "counts": {
            "required_complete_through": "2026-09-15T00:00:00+08:00",
            "raw_assignments": 4000,
            "raw_orders": 500,
            "assigned_users": 4000,
            "control_users": 2000,
            "treatment_users": 2000,
            "unique_orders": 500,
            "included_orders": 500,
            "duplicate_orders": 0,
            "duplicate_assignments": 0,
            "excluded_orders": 0,
            "late_arriving_orders": 0
          },
          "issues": []
        },
        "decision": {
          "status": "NEEDS_CONFIRMATION",
          "label": "请先确认口径与水位",
          "reason": "分母为全部唯一入组用户；按每人入组后 7 天支付计算，只有完整性声明成立时才计零。"
        },
        "owner": "数据负责人",
        "next_action": "核对口径、上游完整性证据和去重记录，署名确认当前数据包版本。",
        "report": null,
        "confirmation": null,
        "card_id": "d5bd79d189179625f1f011b292e95dc1d4849e5d8656b0c5c625ae09942827a2",
        "history": [
          {
            "event": "imported",
            "at": "2026-10-23T08:08:06.238081+00:00",
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7"
          }
        ],
        "human_review": null,
        "engine_version": "bundle-review-v1",
        "markdown": "# 请先确认口径与水位\n\n分母为全部唯一入组用户；按每人入组后 7 天支付计算，只有完整性声明成立时才计零。\n\n**接管角色：** 数据负责人\n\n**下一步：** 核对口径、上游完整性证据和去重记录，署名确认当前数据包版本。\n\n## 口径与数据\n\n- 用户级随机；分母为全部唯一入组用户。\n- 每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款，单位 CNY。\n- 数据来源声明：synthetic。\n- 订单完整性水位：2026-09-15T00:00:00+08:00。\n- 水位由上游声明并由本地负责人确认，系统不认证其真实性。\n\n版本：4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7 · 评审卡：d5bd79d189179625f1f011b292e95dc1d4849e5d8656b0c5c625ae09942827a2 · bundle-review-v1\n\n本卡不执行上线。撤回或数据更新后，需要重新确认当前版本。"
      },
      "confirmed": {
        "status": "REVIEW_READY",
        "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
        "inspection": {
          "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
          "valid": true,
          "contract": {
            "schema_version": 1,
            "experiment_id": "synthetic-detail-page-001",
            "objective": "提升详情页 7 天支付转化率，同时限制每用户支付 GMV 损失",
            "randomization_unit": "user",
            "expected_control_ratio": 0.5,
            "enrollment_start": "2026-09-01T00:00:00+08:00",
            "enrollment_end": "2026-09-08T00:00:00+08:00",
            "observation_days": 7,
            "timezone": "Asia/Shanghai",
            "currency": "CNY",
            "conversion_event": "paid_order",
            "denominator": "all_assigned_users",
            "zero_policy": "after_watermark_only",
            "refunds": "not_deducted",
            "alpha": 0.05,
            "analysis_mode": "fixed_horizon",
            "policy": {
              "intent": "conversion_guarded",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "manifest": {
            "snapshot_at": "2026-09-16T12:00:00+08:00",
            "assignments_complete_through": "2026-09-08T00:00:00+08:00",
            "orders_complete_through": "2026-09-15T00:00:00+08:00",
            "source_evidence": "SYNTHETIC-WATERMARK-001：仅用于验证数据规则的合成完整性声明",
            "origin": "synthetic"
          },
          "counts": {
            "required_complete_through": "2026-09-15T00:00:00+08:00",
            "raw_assignments": 4000,
            "raw_orders": 500,
            "assigned_users": 4000,
            "control_users": 2000,
            "treatment_users": 2000,
            "unique_orders": 500,
            "included_orders": 500,
            "duplicate_orders": 0,
            "duplicate_assignments": 0,
            "excluded_orders": 0,
            "late_arriving_orders": 0
          },
          "issues": []
        },
        "decision": {
          "core_ci": [
            0.029560855038664492,
            0.07043914496133549
          ],
          "gmv_ci": [
            -0.016326154309639837,
            0.017326154309639838
          ],
          "allowed_gmv_loss": 0.02,
          "policy_id": "423074f31e9d66431a31cacc03364458ded356468d43137edc678309e325f0de",
          "method": "predeclared absolute margin with two-sided 95% difference CI; one core and one guardrail",
          "status": "REVIEW_READY",
          "label": "可进入人工发布评审",
          "reason": "主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。"
        },
        "owner": "业务负责人",
        "next_action": "核对收益、预设风险边界与实施成本后，由业务负责人记录人工复核；系统不执行上线。",
        "report": {
          "status": "DONE",
          "task_type": "release_recommendation",
          "summary": "可进入人工发布评审：主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。",
          "review_gate": {
            "status": "READY",
            "checks": {
              "quality_check": "PASS",
              "metric_analysis": "PASS",
              "result_validation": "PASS"
            },
            "blockers": [],
            "owner": "实验分析负责人",
            "next_action": "必检已完成；由业务负责人结合证据与风险，确认是否进入发布评审。"
          },
          "plan": [
            {
              "name": "确认输入",
              "purpose": "确认核心指标、护栏指标和发布标准"
            },
            {
              "name": "质量检查",
              "purpose": "若实验质量异常则降低建议强度"
            },
            {
              "name": "指标判断",
              "purpose": "综合核心指标、护栏指标和风险"
            },
            {
              "name": "发布建议",
              "purpose": "给出不发布 / 灰度 / 可发布建议"
            }
          ],
          "missing_inputs": [],
          "warnings": [],
          "report_scope": {
            "source": "csv_bundle",
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
            "input_counts": {
              "required_complete_through": "2026-09-15T00:00:00+08:00",
              "raw_assignments": 4000,
              "raw_orders": 500,
              "assigned_users": 4000,
              "control_users": 2000,
              "treatment_users": 2000,
              "unique_orders": 500,
              "included_orders": 500,
              "duplicate_orders": 0,
              "duplicate_assignments": 0,
              "excluded_orders": 0,
              "late_arriving_orders": 0
            },
            "definition_confirmation": {
              "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
              "by": "合成回放：数据负责人",
              "at": "2026-10-23T08:08:06.246943+00:00",
              "scope": "definitions_and_declared_completeness"
            },
            "predeclared_policy": {
              "intent": "conversion_guarded",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "registry_entries": [],
          "quality_issues": [],
          "metric_results": [
            {
              "metric_name": "paid_user_cvr",
              "metric_kind": "conversion",
              "metric_role": "core",
              "direction": "increase",
              "control_n": 2000,
              "treatment_n": 2000,
              "control_value": 0.1,
              "treatment_value": 0.15,
              "delta_abs": 0.04999999999999999,
              "delta_rel": 0.4999999999999999,
              "p_value": 1.7449962508738146e-06,
              "ci_low": 0.029560855038664492,
              "ci_high": 0.07043914496133549,
              "significant": true,
              "statistical_method": "two_proportion_z_test_pooled; wald_ci_unpooled",
              "interpretation": "实验组相对对照组显著提升。",
              "statistical_source": "computed",
              "source_summary": "",
              "notes": ""
            },
            {
              "metric_name": "paid_gmv_per_user",
              "metric_kind": "continuous",
              "metric_role": "guardrail",
              "direction": "increase",
              "control_n": 2000,
              "treatment_n": 2000,
              "control_value": 0.1,
              "treatment_value": 0.1005,
              "delta_abs": 0.0005000000000000004,
              "delta_rel": 0.0050000000000000044,
              "p_value": 0.953544503361986,
              "ci_low": -0.016326154309639837,
              "ci_high": 0.017326154309639838,
              "significant": false,
              "statistical_method": "welch_t_test; df=3809.35",
              "interpretation": "统计上未达到显著，当前更适合表述为未形成足够证据。",
              "statistical_source": "computed",
              "source_summary": "",
              "notes": ""
            }
          ],
          "segment_findings": [],
          "facts": [
            {
              "label": "paid_user_cvr 指标结果",
              "evidence": "paid_user_cvr 对照 0.1000，实验 0.1500，绝对变化 0.0500，p=0.0000",
              "strength": "事实"
            },
            {
              "label": "paid_gmv_per_user 指标结果",
              "evidence": "paid_gmv_per_user 对照 0.1000，实验 0.1005，绝对变化 0.0005，p=0.9535",
              "strength": "事实"
            }
          ],
          "inferences": [
            {
              "label": "paid_user_cvr 方向判断",
              "evidence": "实验组相对对照组显著提升。",
              "strength": "合理推断"
            }
          ],
          "hypotheses": [],
          "recommendations": [
            {
              "label": "可进入人工发布评审",
              "reason": "主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。"
            }
          ],
          "selected_skills": [
            "quality_check",
            "experiment_recap",
            "release_recommendation"
          ],
          "agent_trace": [
            {
              "tool_name": "check_quality",
              "input": {
                "request": {
                  "type": "ExperimentRequest"
                }
              },
              "output": {
                "summary": {
                  "type": "list",
                  "count": 0
                }
              },
              "status": "ok",
              "latency_ms": 0.01,
              "error": ""
            },
            {
              "tool_name": "analyze_metric",
              "input": {
                "metrics": {
                  "type": "list",
                  "count": 2
                },
                "alpha": 0.05
              },
              "output": {
                "summary": {
                  "type": "list",
                  "count": 2
                }
              },
              "status": "ok",
              "latency_ms": 0.17,
              "error": ""
            },
            {
              "tool_name": "make_recommendation",
              "input": {
                "metric_results": {
                  "type": "list",
                  "count": 2
                },
                "quality_issues": {
                  "type": "list",
                  "count": 0
                }
              },
              "output": {
                "summary": {
                  "type": "list",
                  "count": 2
                }
              },
              "status": "ok",
              "latency_ms": 0.0,
              "error": ""
            }
          ],
          "workflow_trace": [
            {
              "stage": "planner",
              "status": "ok",
              "detail": {
                "skills": [
                  "quality_check",
                  "experiment_recap",
                  "release_recommendation"
                ],
                "tools": [
                  "check_quality",
                  "analyze_metric",
                  "make_recommendation"
                ]
              }
            },
            {
              "stage": "input_validation",
              "status": "ok",
              "detail": {
                "missing_inputs": []
              }
            },
            {
              "stage": "skill:quality_check",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "skill:experiment_recap",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "result_validation",
              "status": "ok",
              "detail": {
                "check_status": "PASS",
                "warning_count": 0
              }
            },
            {
              "stage": "skill:release_recommendation",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "guardrails",
              "status": "ok",
              "detail": {
                "review_status": "READY",
                "checks": {
                  "quality_check": "PASS",
                  "metric_analysis": "PASS",
                  "result_validation": "PASS"
                }
              }
            },
            {
              "stage": "report_generation",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "risk_policy",
              "status": "REVIEW_READY",
              "detail": {
                "policy_id": "423074f31e9d66431a31cacc03364458ded356468d43137edc678309e325f0de",
                "intent": "conversion_guarded"
              }
            }
          ]
        },
        "confirmation": {
          "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
          "by": "合成回放：数据负责人",
          "at": "2026-10-23T08:08:06.246943+00:00",
          "scope": "definitions_and_declared_completeness"
        },
        "card_id": "406b823086adb9b34b08bd1b483cabf85514a450c8ecfa3ca066056c1fa2a27c",
        "history": [
          {
            "event": "imported",
            "at": "2026-10-23T08:08:06.238081+00:00",
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7"
          },
          {
            "event": "definitions_confirmed",
            "at": "2026-10-23T08:08:06.246943+00:00",
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
            "by": "合成回放：数据负责人",
            "scope": "definitions_and_declared_completeness"
          }
        ],
        "human_review": null,
        "engine_version": "bundle-review-v1",
        "markdown": "# 可进入人工发布评审\n\n主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。\n\n**接管角色：** 业务负责人\n\n**下一步：** 核对收益、预设风险边界与实施成本后，由业务负责人记录人工复核；系统不执行上线。\n\n## 口径与数据\n\n- 用户级随机；分母为全部唯一入组用户。\n- 每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款，单位 CNY。\n- 数据来源声明：synthetic。\n- 订单完整性水位：2026-09-15T00:00:00+08:00。\n- 水位由上游声明并由本地负责人确认，系统不认证其真实性。\n\n## 核心证据\n\n| 指标 | 对照 | 实验 | 绝对差值 | 差值 95% 区间 |\n| --- | ---: | ---: | ---: | --- |\n| 7 天支付用户转化率 | 10.00% | 15.00% | +5.00 个百分点 | [2.9561, 7.0439] 个百分点 |\n| 7 天支付 GMV / 用户 | ¥0.1000 | ¥0.1005 | ¥+0.0005 | [-0.0163, 0.0173] 元 / 用户 |\n\n## 预设风险边界\n\n- 每用户 GMV 最多允许损失 ¥0.0200。\n- 使用双侧 95% 差值区间保守判断；跨越允许损失边界时返回证据不足。\n- 本次只处理一个主指标与一个护栏；不等同于完整实验平台风险控制。\n\n口径确认：合成回放：数据负责人；仅为本地署名记录，不是企业身份认证或上线批准。\n\n版本：4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7 · 评审卡：406b823086adb9b34b08bd1b483cabf85514a450c8ecfa3ca066056c1fa2a27c · bundle-review-v1\n\n本卡不执行上线。撤回或数据更新后，需要重新确认当前版本。"
      },
      "recovery": null
    },
    {
      "id": "immature",
      "name": "等待数据 → 修复重跑",
      "description": "水位未覆盖完整窗口时暂停；替换完整数据包后重新确认。",
      "inspection": {
        "status": "BLOCKED",
        "snapshot_id": "c0d9038619459dfba2b962e10f410f99c812ceeafd1458077a02a3638e4bfc98",
        "inspection": {
          "snapshot_id": "c0d9038619459dfba2b962e10f410f99c812ceeafd1458077a02a3638e4bfc98",
          "valid": false,
          "contract": {
            "schema_version": 1,
            "experiment_id": "synthetic-detail-page-001",
            "objective": "提升详情页 7 天支付转化率，同时限制每用户支付 GMV 损失",
            "randomization_unit": "user",
            "expected_control_ratio": 0.5,
            "enrollment_start": "2026-09-01T00:00:00+08:00",
            "enrollment_end": "2026-09-08T00:00:00+08:00",
            "observation_days": 7,
            "timezone": "Asia/Shanghai",
            "currency": "CNY",
            "conversion_event": "paid_order",
            "denominator": "all_assigned_users",
            "zero_policy": "after_watermark_only",
            "refunds": "not_deducted",
            "alpha": 0.05,
            "analysis_mode": "fixed_horizon",
            "policy": {
              "intent": "conversion_guarded",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "manifest": {
            "snapshot_at": "2026-09-16T12:00:00+08:00",
            "assignments_complete_through": "2026-09-08T00:00:00+08:00",
            "orders_complete_through": "2026-09-12T00:00:00+08:00",
            "source_evidence": "SYNTHETIC-WATERMARK-001：仅用于验证数据规则的合成完整性声明",
            "origin": "synthetic"
          },
          "counts": {
            "required_complete_through": "2026-09-15T00:00:00+08:00"
          },
          "issues": [
            {
              "code": "DATA_NOT_MATURE",
              "message": "上游水位尚未覆盖入组区间及完整 7 天观察窗口，不能将无订单用户计零。",
              "next_action": "等待上游完整性水位覆盖 2026-09-15T00:00:00+08:00，重新导出完整数据包。",
              "blocking": true,
              "owner": "数据负责人"
            }
          ]
        },
        "decision": {
          "status": "BLOCKED",
          "label": "数据包需要修复",
          "reason": "上游水位尚未覆盖入组区间及完整 7 天观察窗口，不能将无订单用户计零。"
        },
        "owner": "数据负责人",
        "next_action": "等待上游完整性水位覆盖 2026-09-15T00:00:00+08:00，重新导出完整数据包。",
        "report": null,
        "confirmation": null,
        "card_id": "6b3eac5ca1cf994bc7888c9af884630039926642bac5d93d1a594839141c7d11",
        "history": [
          {
            "event": "imported",
            "at": "2026-10-23T08:08:06.260309+00:00",
            "snapshot_id": "c0d9038619459dfba2b962e10f410f99c812ceeafd1458077a02a3638e4bfc98"
          }
        ],
        "human_review": null,
        "engine_version": "bundle-review-v1",
        "markdown": "# 数据包需要修复\n\n上游水位尚未覆盖入组区间及完整 7 天观察窗口，不能将无订单用户计零。\n\n**接管角色：** 数据负责人\n\n**下一步：** 等待上游完整性水位覆盖 2026-09-15T00:00:00+08:00，重新导出完整数据包。\n\n## 口径与数据\n\n- 用户级随机；分母为全部唯一入组用户。\n- 每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款，单位 CNY。\n- 数据来源声明：synthetic。\n- 订单完整性水位：2026-09-12T00:00:00+08:00。\n- 水位由上游声明并由本地负责人确认，系统不认证其真实性。\n\n## 数据处理与待办\n\n- 上游水位尚未覆盖入组区间及完整 7 天观察窗口，不能将无订单用户计零。 接管：数据负责人。等待上游完整性水位覆盖 2026-09-15T00:00:00+08:00，重新导出完整数据包。\n\n版本：c0d9038619459dfba2b962e10f410f99c812ceeafd1458077a02a3638e4bfc98 · 评审卡：6b3eac5ca1cf994bc7888c9af884630039926642bac5d93d1a594839141c7d11 · bundle-review-v1\n\n本卡不执行上线。撤回或数据更新后，需要重新确认当前版本。"
      },
      "confirmed": null,
      "recovery": {
        "inspection": {
          "status": "NEEDS_CONFIRMATION",
          "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
          "inspection": {
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
            "valid": true,
            "contract": {
              "schema_version": 1,
              "experiment_id": "synthetic-detail-page-001",
              "objective": "提升详情页 7 天支付转化率，同时限制每用户支付 GMV 损失",
              "randomization_unit": "user",
              "expected_control_ratio": 0.5,
              "enrollment_start": "2026-09-01T00:00:00+08:00",
              "enrollment_end": "2026-09-08T00:00:00+08:00",
              "observation_days": 7,
              "timezone": "Asia/Shanghai",
              "currency": "CNY",
              "conversion_event": "paid_order",
              "denominator": "all_assigned_users",
              "zero_policy": "after_watermark_only",
              "refunds": "not_deducted",
              "alpha": 0.05,
              "analysis_mode": "fixed_horizon",
              "policy": {
                "intent": "conversion_guarded",
                "max_gmv_loss_per_user": "0.02",
                "declared_at": "2026-08-31T10:00:00+08:00"
              }
            },
            "manifest": {
              "snapshot_at": "2026-09-16T12:00:00+08:00",
              "assignments_complete_through": "2026-09-08T00:00:00+08:00",
              "orders_complete_through": "2026-09-15T00:00:00+08:00",
              "source_evidence": "SYNTHETIC-WATERMARK-001：仅用于验证数据规则的合成完整性声明",
              "origin": "synthetic"
            },
            "counts": {
              "required_complete_through": "2026-09-15T00:00:00+08:00",
              "raw_assignments": 4000,
              "raw_orders": 500,
              "assigned_users": 4000,
              "control_users": 2000,
              "treatment_users": 2000,
              "unique_orders": 500,
              "included_orders": 500,
              "duplicate_orders": 0,
              "duplicate_assignments": 0,
              "excluded_orders": 0,
              "late_arriving_orders": 0
            },
            "issues": []
          },
          "decision": {
            "status": "NEEDS_CONFIRMATION",
            "label": "请先确认口径与水位",
            "reason": "分母为全部唯一入组用户；按每人入组后 7 天支付计算，只有完整性声明成立时才计零。"
          },
          "owner": "数据负责人",
          "next_action": "核对口径、上游完整性证据和去重记录，署名确认当前数据包版本。",
          "report": null,
          "confirmation": null,
          "card_id": "d5bd79d189179625f1f011b292e95dc1d4849e5d8656b0c5c625ae09942827a2",
          "history": [
            {
              "event": "imported",
              "at": "2026-10-23T08:08:06.260309+00:00",
              "snapshot_id": "c0d9038619459dfba2b962e10f410f99c812ceeafd1458077a02a3638e4bfc98"
            },
            {
              "event": "superseded",
              "at": "2026-10-23T08:08:06.273115+00:00",
              "snapshot_id": "c0d9038619459dfba2b962e10f410f99c812ceeafd1458077a02a3638e4bfc98",
              "replacement": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7"
            },
            {
              "event": "imported",
              "at": "2026-10-23T08:08:06.273117+00:00",
              "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7"
            }
          ],
          "human_review": null,
          "engine_version": "bundle-review-v1",
          "markdown": "# 请先确认口径与水位\n\n分母为全部唯一入组用户；按每人入组后 7 天支付计算，只有完整性声明成立时才计零。\n\n**接管角色：** 数据负责人\n\n**下一步：** 核对口径、上游完整性证据和去重记录，署名确认当前数据包版本。\n\n## 口径与数据\n\n- 用户级随机；分母为全部唯一入组用户。\n- 每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款，单位 CNY。\n- 数据来源声明：synthetic。\n- 订单完整性水位：2026-09-15T00:00:00+08:00。\n- 水位由上游声明并由本地负责人确认，系统不认证其真实性。\n\n版本：4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7 · 评审卡：d5bd79d189179625f1f011b292e95dc1d4849e5d8656b0c5c625ae09942827a2 · bundle-review-v1\n\n本卡不执行上线。撤回或数据更新后，需要重新确认当前版本。"
        },
        "confirmed": {
          "status": "REVIEW_READY",
          "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
          "inspection": {
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
            "valid": true,
            "contract": {
              "schema_version": 1,
              "experiment_id": "synthetic-detail-page-001",
              "objective": "提升详情页 7 天支付转化率，同时限制每用户支付 GMV 损失",
              "randomization_unit": "user",
              "expected_control_ratio": 0.5,
              "enrollment_start": "2026-09-01T00:00:00+08:00",
              "enrollment_end": "2026-09-08T00:00:00+08:00",
              "observation_days": 7,
              "timezone": "Asia/Shanghai",
              "currency": "CNY",
              "conversion_event": "paid_order",
              "denominator": "all_assigned_users",
              "zero_policy": "after_watermark_only",
              "refunds": "not_deducted",
              "alpha": 0.05,
              "analysis_mode": "fixed_horizon",
              "policy": {
                "intent": "conversion_guarded",
                "max_gmv_loss_per_user": "0.02",
                "declared_at": "2026-08-31T10:00:00+08:00"
              }
            },
            "manifest": {
              "snapshot_at": "2026-09-16T12:00:00+08:00",
              "assignments_complete_through": "2026-09-08T00:00:00+08:00",
              "orders_complete_through": "2026-09-15T00:00:00+08:00",
              "source_evidence": "SYNTHETIC-WATERMARK-001：仅用于验证数据规则的合成完整性声明",
              "origin": "synthetic"
            },
            "counts": {
              "required_complete_through": "2026-09-15T00:00:00+08:00",
              "raw_assignments": 4000,
              "raw_orders": 500,
              "assigned_users": 4000,
              "control_users": 2000,
              "treatment_users": 2000,
              "unique_orders": 500,
              "included_orders": 500,
              "duplicate_orders": 0,
              "duplicate_assignments": 0,
              "excluded_orders": 0,
              "late_arriving_orders": 0
            },
            "issues": []
          },
          "decision": {
            "core_ci": [
              0.029560855038664492,
              0.07043914496133549
            ],
            "gmv_ci": [
              -0.016326154309639837,
              0.017326154309639838
            ],
            "allowed_gmv_loss": 0.02,
            "policy_id": "423074f31e9d66431a31cacc03364458ded356468d43137edc678309e325f0de",
            "method": "predeclared absolute margin with two-sided 95% difference CI; one core and one guardrail",
            "status": "REVIEW_READY",
            "label": "可进入人工发布评审",
            "reason": "主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。"
          },
          "owner": "业务负责人",
          "next_action": "核对收益、预设风险边界与实施成本后，由业务负责人记录人工复核；系统不执行上线。",
          "report": {
            "status": "DONE",
            "task_type": "release_recommendation",
            "summary": "可进入人工发布评审：主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。",
            "review_gate": {
              "status": "READY",
              "checks": {
                "quality_check": "PASS",
                "metric_analysis": "PASS",
                "result_validation": "PASS"
              },
              "blockers": [],
              "owner": "实验分析负责人",
              "next_action": "必检已完成；由业务负责人结合证据与风险，确认是否进入发布评审。"
            },
            "plan": [
              {
                "name": "确认输入",
                "purpose": "确认核心指标、护栏指标和发布标准"
              },
              {
                "name": "质量检查",
                "purpose": "若实验质量异常则降低建议强度"
              },
              {
                "name": "指标判断",
                "purpose": "综合核心指标、护栏指标和风险"
              },
              {
                "name": "发布建议",
                "purpose": "给出不发布 / 灰度 / 可发布建议"
              }
            ],
            "missing_inputs": [],
            "warnings": [],
            "report_scope": {
              "source": "csv_bundle",
              "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
              "input_counts": {
                "required_complete_through": "2026-09-15T00:00:00+08:00",
                "raw_assignments": 4000,
                "raw_orders": 500,
                "assigned_users": 4000,
                "control_users": 2000,
                "treatment_users": 2000,
                "unique_orders": 500,
                "included_orders": 500,
                "duplicate_orders": 0,
                "duplicate_assignments": 0,
                "excluded_orders": 0,
                "late_arriving_orders": 0
              },
              "definition_confirmation": {
                "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
                "by": "合成回放：修复负责人",
                "at": "2026-10-23T08:08:06.282078+00:00",
                "scope": "definitions_and_declared_completeness"
              },
              "predeclared_policy": {
                "intent": "conversion_guarded",
                "max_gmv_loss_per_user": "0.02",
                "declared_at": "2026-08-31T10:00:00+08:00"
              }
            },
            "registry_entries": [],
            "quality_issues": [],
            "metric_results": [
              {
                "metric_name": "paid_user_cvr",
                "metric_kind": "conversion",
                "metric_role": "core",
                "direction": "increase",
                "control_n": 2000,
                "treatment_n": 2000,
                "control_value": 0.1,
                "treatment_value": 0.15,
                "delta_abs": 0.04999999999999999,
                "delta_rel": 0.4999999999999999,
                "p_value": 1.7449962508738146e-06,
                "ci_low": 0.029560855038664492,
                "ci_high": 0.07043914496133549,
                "significant": true,
                "statistical_method": "two_proportion_z_test_pooled; wald_ci_unpooled",
                "interpretation": "实验组相对对照组显著提升。",
                "statistical_source": "computed",
                "source_summary": "",
                "notes": ""
              },
              {
                "metric_name": "paid_gmv_per_user",
                "metric_kind": "continuous",
                "metric_role": "guardrail",
                "direction": "increase",
                "control_n": 2000,
                "treatment_n": 2000,
                "control_value": 0.1,
                "treatment_value": 0.1005,
                "delta_abs": 0.0005000000000000004,
                "delta_rel": 0.0050000000000000044,
                "p_value": 0.953544503361986,
                "ci_low": -0.016326154309639837,
                "ci_high": 0.017326154309639838,
                "significant": false,
                "statistical_method": "welch_t_test; df=3809.35",
                "interpretation": "统计上未达到显著，当前更适合表述为未形成足够证据。",
                "statistical_source": "computed",
                "source_summary": "",
                "notes": ""
              }
            ],
            "segment_findings": [],
            "facts": [
              {
                "label": "paid_user_cvr 指标结果",
                "evidence": "paid_user_cvr 对照 0.1000，实验 0.1500，绝对变化 0.0500，p=0.0000",
                "strength": "事实"
              },
              {
                "label": "paid_gmv_per_user 指标结果",
                "evidence": "paid_gmv_per_user 对照 0.1000，实验 0.1005，绝对变化 0.0005，p=0.9535",
                "strength": "事实"
              }
            ],
            "inferences": [
              {
                "label": "paid_user_cvr 方向判断",
                "evidence": "实验组相对对照组显著提升。",
                "strength": "合理推断"
              }
            ],
            "hypotheses": [],
            "recommendations": [
              {
                "label": "可进入人工发布评审",
                "reason": "主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。"
              }
            ],
            "selected_skills": [
              "quality_check",
              "experiment_recap",
              "release_recommendation"
            ],
            "agent_trace": [
              {
                "tool_name": "check_quality",
                "input": {
                  "request": {
                    "type": "ExperimentRequest"
                  }
                },
                "output": {
                  "summary": {
                    "type": "list",
                    "count": 0
                  }
                },
                "status": "ok",
                "latency_ms": 0.01,
                "error": ""
              },
              {
                "tool_name": "analyze_metric",
                "input": {
                  "metrics": {
                    "type": "list",
                    "count": 2
                  },
                  "alpha": 0.05
                },
                "output": {
                  "summary": {
                    "type": "list",
                    "count": 2
                  }
                },
                "status": "ok",
                "latency_ms": 0.14,
                "error": ""
              },
              {
                "tool_name": "make_recommendation",
                "input": {
                  "metric_results": {
                    "type": "list",
                    "count": 2
                  },
                  "quality_issues": {
                    "type": "list",
                    "count": 0
                  }
                },
                "output": {
                  "summary": {
                    "type": "list",
                    "count": 2
                  }
                },
                "status": "ok",
                "latency_ms": 0.0,
                "error": ""
              }
            ],
            "workflow_trace": [
              {
                "stage": "planner",
                "status": "ok",
                "detail": {
                  "skills": [
                    "quality_check",
                    "experiment_recap",
                    "release_recommendation"
                  ],
                  "tools": [
                    "check_quality",
                    "analyze_metric",
                    "make_recommendation"
                  ]
                }
              },
              {
                "stage": "input_validation",
                "status": "ok",
                "detail": {
                  "missing_inputs": []
                }
              },
              {
                "stage": "skill:quality_check",
                "status": "ok",
                "detail": {}
              },
              {
                "stage": "skill:experiment_recap",
                "status": "ok",
                "detail": {}
              },
              {
                "stage": "result_validation",
                "status": "ok",
                "detail": {
                  "check_status": "PASS",
                  "warning_count": 0
                }
              },
              {
                "stage": "skill:release_recommendation",
                "status": "ok",
                "detail": {}
              },
              {
                "stage": "guardrails",
                "status": "ok",
                "detail": {
                  "review_status": "READY",
                  "checks": {
                    "quality_check": "PASS",
                    "metric_analysis": "PASS",
                    "result_validation": "PASS"
                  }
                }
              },
              {
                "stage": "report_generation",
                "status": "ok",
                "detail": {}
              },
              {
                "stage": "risk_policy",
                "status": "REVIEW_READY",
                "detail": {
                  "policy_id": "423074f31e9d66431a31cacc03364458ded356468d43137edc678309e325f0de",
                  "intent": "conversion_guarded"
                }
              }
            ]
          },
          "confirmation": {
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
            "by": "合成回放：修复负责人",
            "at": "2026-10-23T08:08:06.282078+00:00",
            "scope": "definitions_and_declared_completeness"
          },
          "card_id": "406b823086adb9b34b08bd1b483cabf85514a450c8ecfa3ca066056c1fa2a27c",
          "history": [
            {
              "event": "imported",
              "at": "2026-10-23T08:08:06.260309+00:00",
              "snapshot_id": "c0d9038619459dfba2b962e10f410f99c812ceeafd1458077a02a3638e4bfc98"
            },
            {
              "event": "superseded",
              "at": "2026-10-23T08:08:06.273115+00:00",
              "snapshot_id": "c0d9038619459dfba2b962e10f410f99c812ceeafd1458077a02a3638e4bfc98",
              "replacement": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7"
            },
            {
              "event": "imported",
              "at": "2026-10-23T08:08:06.273117+00:00",
              "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7"
            },
            {
              "event": "definitions_confirmed",
              "at": "2026-10-23T08:08:06.282078+00:00",
              "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
              "by": "合成回放：修复负责人",
              "scope": "definitions_and_declared_completeness"
            }
          ],
          "human_review": null,
          "engine_version": "bundle-review-v1",
          "markdown": "# 可进入人工发布评审\n\n主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。\n\n**接管角色：** 业务负责人\n\n**下一步：** 核对收益、预设风险边界与实施成本后，由业务负责人记录人工复核；系统不执行上线。\n\n## 口径与数据\n\n- 用户级随机；分母为全部唯一入组用户。\n- 每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款，单位 CNY。\n- 数据来源声明：synthetic。\n- 订单完整性水位：2026-09-15T00:00:00+08:00。\n- 水位由上游声明并由本地负责人确认，系统不认证其真实性。\n\n## 核心证据\n\n| 指标 | 对照 | 实验 | 绝对差值 | 差值 95% 区间 |\n| --- | ---: | ---: | ---: | --- |\n| 7 天支付用户转化率 | 10.00% | 15.00% | +5.00 个百分点 | [2.9561, 7.0439] 个百分点 |\n| 7 天支付 GMV / 用户 | ¥0.1000 | ¥0.1005 | ¥+0.0005 | [-0.0163, 0.0173] 元 / 用户 |\n\n## 预设风险边界\n\n- 每用户 GMV 最多允许损失 ¥0.0200。\n- 使用双侧 95% 差值区间保守判断；跨越允许损失边界时返回证据不足。\n- 本次只处理一个主指标与一个护栏；不等同于完整实验平台风险控制。\n\n口径确认：合成回放：修复负责人；仅为本地署名记录，不是企业身份认证或上线批准。\n\n版本：4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7 · 评审卡：406b823086adb9b34b08bd1b483cabf85514a450c8ecfa3ca066056c1fa2a27c · bundle-review-v1\n\n本卡不执行上线。撤回或数据更新后，需要重新确认当前版本。"
        }
      }
    },
    {
      "id": "cross_group",
      "name": "跨组用户 → 人工接管",
      "description": "随机化单位被污染时不猜测分组；修复关联链路后重跑。",
      "inspection": {
        "status": "BLOCKED",
        "snapshot_id": "05fb577dababc0b234f241ff6272d07caa7f0b172b0c8e842fccde1bdb8e70a6",
        "inspection": {
          "snapshot_id": "05fb577dababc0b234f241ff6272d07caa7f0b172b0c8e842fccde1bdb8e70a6",
          "valid": false,
          "contract": {
            "schema_version": 1,
            "experiment_id": "synthetic-detail-page-001",
            "objective": "提升详情页 7 天支付转化率，同时限制每用户支付 GMV 损失",
            "randomization_unit": "user",
            "expected_control_ratio": 0.5,
            "enrollment_start": "2026-09-01T00:00:00+08:00",
            "enrollment_end": "2026-09-08T00:00:00+08:00",
            "observation_days": 7,
            "timezone": "Asia/Shanghai",
            "currency": "CNY",
            "conversion_event": "paid_order",
            "denominator": "all_assigned_users",
            "zero_policy": "after_watermark_only",
            "refunds": "not_deducted",
            "alpha": 0.05,
            "analysis_mode": "fixed_horizon",
            "policy": {
              "intent": "conversion_guarded",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "manifest": {
            "snapshot_at": "2026-09-16T12:00:00+08:00",
            "assignments_complete_through": "2026-09-08T00:00:00+08:00",
            "orders_complete_through": "2026-09-15T00:00:00+08:00",
            "source_evidence": "SYNTHETIC-WATERMARK-001：仅用于验证数据规则的合成完整性声明",
            "origin": "synthetic"
          },
          "counts": {
            "required_complete_through": "2026-09-15T00:00:00+08:00",
            "raw_assignments": 4001,
            "raw_orders": 500
          },
          "issues": [
            {
              "code": "CROSS_GROUP_USER",
              "message": "assignments.csv 第 4002 行出现同一用户的冲突入组；不能静默选择一组。",
              "next_action": "修复数据包后重新导入并确认口径。",
              "blocking": true,
              "owner": "数据负责人"
            }
          ]
        },
        "decision": {
          "status": "BLOCKED",
          "label": "数据包需要修复",
          "reason": "assignments.csv 第 4002 行出现同一用户的冲突入组；不能静默选择一组。"
        },
        "owner": "数据负责人",
        "next_action": "修复数据包后重新导入并确认口径。",
        "report": null,
        "confirmation": null,
        "card_id": "6cb334f9b270b162a78c9e68f0880da3e60b63d0d1c9635fd172ec8648b15a7c",
        "history": [
          {
            "event": "imported",
            "at": "2026-10-23T08:08:06.301710+00:00",
            "snapshot_id": "05fb577dababc0b234f241ff6272d07caa7f0b172b0c8e842fccde1bdb8e70a6"
          }
        ],
        "human_review": null,
        "engine_version": "bundle-review-v1",
        "markdown": "# 数据包需要修复\n\nassignments.csv 第 4002 行出现同一用户的冲突入组；不能静默选择一组。\n\n**接管角色：** 数据负责人\n\n**下一步：** 修复数据包后重新导入并确认口径。\n\n## 口径与数据\n\n- 用户级随机；分母为全部唯一入组用户。\n- 每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款，单位 CNY。\n- 数据来源声明：synthetic。\n- 订单完整性水位：2026-09-15T00:00:00+08:00。\n- 水位由上游声明并由本地负责人确认，系统不认证其真实性。\n\n## 数据处理与待办\n\n- assignments.csv 第 4002 行出现同一用户的冲突入组；不能静默选择一组。 接管：数据负责人。修复数据包后重新导入并确认口径。\n\n版本：05fb577dababc0b234f241ff6272d07caa7f0b172b0c8e842fccde1bdb8e70a6 · 评审卡：6cb334f9b270b162a78c9e68f0880da3e60b63d0d1c9635fd172ec8648b15a7c · bundle-review-v1\n\n本卡不执行上线。撤回或数据更新后，需要重新确认当前版本。"
      },
      "confirmed": null,
      "recovery": {
        "inspection": {
          "status": "NEEDS_CONFIRMATION",
          "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
          "inspection": {
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
            "valid": true,
            "contract": {
              "schema_version": 1,
              "experiment_id": "synthetic-detail-page-001",
              "objective": "提升详情页 7 天支付转化率，同时限制每用户支付 GMV 损失",
              "randomization_unit": "user",
              "expected_control_ratio": 0.5,
              "enrollment_start": "2026-09-01T00:00:00+08:00",
              "enrollment_end": "2026-09-08T00:00:00+08:00",
              "observation_days": 7,
              "timezone": "Asia/Shanghai",
              "currency": "CNY",
              "conversion_event": "paid_order",
              "denominator": "all_assigned_users",
              "zero_policy": "after_watermark_only",
              "refunds": "not_deducted",
              "alpha": 0.05,
              "analysis_mode": "fixed_horizon",
              "policy": {
                "intent": "conversion_guarded",
                "max_gmv_loss_per_user": "0.02",
                "declared_at": "2026-08-31T10:00:00+08:00"
              }
            },
            "manifest": {
              "snapshot_at": "2026-09-16T12:00:00+08:00",
              "assignments_complete_through": "2026-09-08T00:00:00+08:00",
              "orders_complete_through": "2026-09-15T00:00:00+08:00",
              "source_evidence": "SYNTHETIC-WATERMARK-001：仅用于验证数据规则的合成完整性声明",
              "origin": "synthetic"
            },
            "counts": {
              "required_complete_through": "2026-09-15T00:00:00+08:00",
              "raw_assignments": 4000,
              "raw_orders": 500,
              "assigned_users": 4000,
              "control_users": 2000,
              "treatment_users": 2000,
              "unique_orders": 500,
              "included_orders": 500,
              "duplicate_orders": 0,
              "duplicate_assignments": 0,
              "excluded_orders": 0,
              "late_arriving_orders": 0
            },
            "issues": []
          },
          "decision": {
            "status": "NEEDS_CONFIRMATION",
            "label": "请先确认口径与水位",
            "reason": "分母为全部唯一入组用户；按每人入组后 7 天支付计算，只有完整性声明成立时才计零。"
          },
          "owner": "数据负责人",
          "next_action": "核对口径、上游完整性证据和去重记录，署名确认当前数据包版本。",
          "report": null,
          "confirmation": null,
          "card_id": "d5bd79d189179625f1f011b292e95dc1d4849e5d8656b0c5c625ae09942827a2",
          "history": [
            {
              "event": "imported",
              "at": "2026-10-23T08:08:06.301710+00:00",
              "snapshot_id": "05fb577dababc0b234f241ff6272d07caa7f0b172b0c8e842fccde1bdb8e70a6"
            },
            {
              "event": "superseded",
              "at": "2026-10-23T08:08:06.314381+00:00",
              "snapshot_id": "05fb577dababc0b234f241ff6272d07caa7f0b172b0c8e842fccde1bdb8e70a6",
              "replacement": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7"
            },
            {
              "event": "imported",
              "at": "2026-10-23T08:08:06.314382+00:00",
              "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7"
            }
          ],
          "human_review": null,
          "engine_version": "bundle-review-v1",
          "markdown": "# 请先确认口径与水位\n\n分母为全部唯一入组用户；按每人入组后 7 天支付计算，只有完整性声明成立时才计零。\n\n**接管角色：** 数据负责人\n\n**下一步：** 核对口径、上游完整性证据和去重记录，署名确认当前数据包版本。\n\n## 口径与数据\n\n- 用户级随机；分母为全部唯一入组用户。\n- 每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款，单位 CNY。\n- 数据来源声明：synthetic。\n- 订单完整性水位：2026-09-15T00:00:00+08:00。\n- 水位由上游声明并由本地负责人确认，系统不认证其真实性。\n\n版本：4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7 · 评审卡：d5bd79d189179625f1f011b292e95dc1d4849e5d8656b0c5c625ae09942827a2 · bundle-review-v1\n\n本卡不执行上线。撤回或数据更新后，需要重新确认当前版本。"
        },
        "confirmed": {
          "status": "REVIEW_READY",
          "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
          "inspection": {
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
            "valid": true,
            "contract": {
              "schema_version": 1,
              "experiment_id": "synthetic-detail-page-001",
              "objective": "提升详情页 7 天支付转化率，同时限制每用户支付 GMV 损失",
              "randomization_unit": "user",
              "expected_control_ratio": 0.5,
              "enrollment_start": "2026-09-01T00:00:00+08:00",
              "enrollment_end": "2026-09-08T00:00:00+08:00",
              "observation_days": 7,
              "timezone": "Asia/Shanghai",
              "currency": "CNY",
              "conversion_event": "paid_order",
              "denominator": "all_assigned_users",
              "zero_policy": "after_watermark_only",
              "refunds": "not_deducted",
              "alpha": 0.05,
              "analysis_mode": "fixed_horizon",
              "policy": {
                "intent": "conversion_guarded",
                "max_gmv_loss_per_user": "0.02",
                "declared_at": "2026-08-31T10:00:00+08:00"
              }
            },
            "manifest": {
              "snapshot_at": "2026-09-16T12:00:00+08:00",
              "assignments_complete_through": "2026-09-08T00:00:00+08:00",
              "orders_complete_through": "2026-09-15T00:00:00+08:00",
              "source_evidence": "SYNTHETIC-WATERMARK-001：仅用于验证数据规则的合成完整性声明",
              "origin": "synthetic"
            },
            "counts": {
              "required_complete_through": "2026-09-15T00:00:00+08:00",
              "raw_assignments": 4000,
              "raw_orders": 500,
              "assigned_users": 4000,
              "control_users": 2000,
              "treatment_users": 2000,
              "unique_orders": 500,
              "included_orders": 500,
              "duplicate_orders": 0,
              "duplicate_assignments": 0,
              "excluded_orders": 0,
              "late_arriving_orders": 0
            },
            "issues": []
          },
          "decision": {
            "core_ci": [
              0.029560855038664492,
              0.07043914496133549
            ],
            "gmv_ci": [
              -0.016326154309639837,
              0.017326154309639838
            ],
            "allowed_gmv_loss": 0.02,
            "policy_id": "423074f31e9d66431a31cacc03364458ded356468d43137edc678309e325f0de",
            "method": "predeclared absolute margin with two-sided 95% difference CI; one core and one guardrail",
            "status": "REVIEW_READY",
            "label": "可进入人工发布评审",
            "reason": "主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。"
          },
          "owner": "业务负责人",
          "next_action": "核对收益、预设风险边界与实施成本后，由业务负责人记录人工复核；系统不执行上线。",
          "report": {
            "status": "DONE",
            "task_type": "release_recommendation",
            "summary": "可进入人工发布评审：主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。",
            "review_gate": {
              "status": "READY",
              "checks": {
                "quality_check": "PASS",
                "metric_analysis": "PASS",
                "result_validation": "PASS"
              },
              "blockers": [],
              "owner": "实验分析负责人",
              "next_action": "必检已完成；由业务负责人结合证据与风险，确认是否进入发布评审。"
            },
            "plan": [
              {
                "name": "确认输入",
                "purpose": "确认核心指标、护栏指标和发布标准"
              },
              {
                "name": "质量检查",
                "purpose": "若实验质量异常则降低建议强度"
              },
              {
                "name": "指标判断",
                "purpose": "综合核心指标、护栏指标和风险"
              },
              {
                "name": "发布建议",
                "purpose": "给出不发布 / 灰度 / 可发布建议"
              }
            ],
            "missing_inputs": [],
            "warnings": [],
            "report_scope": {
              "source": "csv_bundle",
              "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
              "input_counts": {
                "required_complete_through": "2026-09-15T00:00:00+08:00",
                "raw_assignments": 4000,
                "raw_orders": 500,
                "assigned_users": 4000,
                "control_users": 2000,
                "treatment_users": 2000,
                "unique_orders": 500,
                "included_orders": 500,
                "duplicate_orders": 0,
                "duplicate_assignments": 0,
                "excluded_orders": 0,
                "late_arriving_orders": 0
              },
              "definition_confirmation": {
                "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
                "by": "合成回放：修复负责人",
                "at": "2026-10-23T08:08:06.323276+00:00",
                "scope": "definitions_and_declared_completeness"
              },
              "predeclared_policy": {
                "intent": "conversion_guarded",
                "max_gmv_loss_per_user": "0.02",
                "declared_at": "2026-08-31T10:00:00+08:00"
              }
            },
            "registry_entries": [],
            "quality_issues": [],
            "metric_results": [
              {
                "metric_name": "paid_user_cvr",
                "metric_kind": "conversion",
                "metric_role": "core",
                "direction": "increase",
                "control_n": 2000,
                "treatment_n": 2000,
                "control_value": 0.1,
                "treatment_value": 0.15,
                "delta_abs": 0.04999999999999999,
                "delta_rel": 0.4999999999999999,
                "p_value": 1.7449962508738146e-06,
                "ci_low": 0.029560855038664492,
                "ci_high": 0.07043914496133549,
                "significant": true,
                "statistical_method": "two_proportion_z_test_pooled; wald_ci_unpooled",
                "interpretation": "实验组相对对照组显著提升。",
                "statistical_source": "computed",
                "source_summary": "",
                "notes": ""
              },
              {
                "metric_name": "paid_gmv_per_user",
                "metric_kind": "continuous",
                "metric_role": "guardrail",
                "direction": "increase",
                "control_n": 2000,
                "treatment_n": 2000,
                "control_value": 0.1,
                "treatment_value": 0.1005,
                "delta_abs": 0.0005000000000000004,
                "delta_rel": 0.0050000000000000044,
                "p_value": 0.953544503361986,
                "ci_low": -0.016326154309639837,
                "ci_high": 0.017326154309639838,
                "significant": false,
                "statistical_method": "welch_t_test; df=3809.35",
                "interpretation": "统计上未达到显著，当前更适合表述为未形成足够证据。",
                "statistical_source": "computed",
                "source_summary": "",
                "notes": ""
              }
            ],
            "segment_findings": [],
            "facts": [
              {
                "label": "paid_user_cvr 指标结果",
                "evidence": "paid_user_cvr 对照 0.1000，实验 0.1500，绝对变化 0.0500，p=0.0000",
                "strength": "事实"
              },
              {
                "label": "paid_gmv_per_user 指标结果",
                "evidence": "paid_gmv_per_user 对照 0.1000，实验 0.1005，绝对变化 0.0005，p=0.9535",
                "strength": "事实"
              }
            ],
            "inferences": [
              {
                "label": "paid_user_cvr 方向判断",
                "evidence": "实验组相对对照组显著提升。",
                "strength": "合理推断"
              }
            ],
            "hypotheses": [],
            "recommendations": [
              {
                "label": "可进入人工发布评审",
                "reason": "主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。"
              }
            ],
            "selected_skills": [
              "quality_check",
              "experiment_recap",
              "release_recommendation"
            ],
            "agent_trace": [
              {
                "tool_name": "check_quality",
                "input": {
                  "request": {
                    "type": "ExperimentRequest"
                  }
                },
                "output": {
                  "summary": {
                    "type": "list",
                    "count": 0
                  }
                },
                "status": "ok",
                "latency_ms": 0.01,
                "error": ""
              },
              {
                "tool_name": "analyze_metric",
                "input": {
                  "metrics": {
                    "type": "list",
                    "count": 2
                  },
                  "alpha": 0.05
                },
                "output": {
                  "summary": {
                    "type": "list",
                    "count": 2
                  }
                },
                "status": "ok",
                "latency_ms": 0.14,
                "error": ""
              },
              {
                "tool_name": "make_recommendation",
                "input": {
                  "metric_results": {
                    "type": "list",
                    "count": 2
                  },
                  "quality_issues": {
                    "type": "list",
                    "count": 0
                  }
                },
                "output": {
                  "summary": {
                    "type": "list",
                    "count": 2
                  }
                },
                "status": "ok",
                "latency_ms": 0.0,
                "error": ""
              }
            ],
            "workflow_trace": [
              {
                "stage": "planner",
                "status": "ok",
                "detail": {
                  "skills": [
                    "quality_check",
                    "experiment_recap",
                    "release_recommendation"
                  ],
                  "tools": [
                    "check_quality",
                    "analyze_metric",
                    "make_recommendation"
                  ]
                }
              },
              {
                "stage": "input_validation",
                "status": "ok",
                "detail": {
                  "missing_inputs": []
                }
              },
              {
                "stage": "skill:quality_check",
                "status": "ok",
                "detail": {}
              },
              {
                "stage": "skill:experiment_recap",
                "status": "ok",
                "detail": {}
              },
              {
                "stage": "result_validation",
                "status": "ok",
                "detail": {
                  "check_status": "PASS",
                  "warning_count": 0
                }
              },
              {
                "stage": "skill:release_recommendation",
                "status": "ok",
                "detail": {}
              },
              {
                "stage": "guardrails",
                "status": "ok",
                "detail": {
                  "review_status": "READY",
                  "checks": {
                    "quality_check": "PASS",
                    "metric_analysis": "PASS",
                    "result_validation": "PASS"
                  }
                }
              },
              {
                "stage": "report_generation",
                "status": "ok",
                "detail": {}
              },
              {
                "stage": "risk_policy",
                "status": "REVIEW_READY",
                "detail": {
                  "policy_id": "423074f31e9d66431a31cacc03364458ded356468d43137edc678309e325f0de",
                  "intent": "conversion_guarded"
                }
              }
            ]
          },
          "confirmation": {
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
            "by": "合成回放：修复负责人",
            "at": "2026-10-23T08:08:06.323276+00:00",
            "scope": "definitions_and_declared_completeness"
          },
          "card_id": "406b823086adb9b34b08bd1b483cabf85514a450c8ecfa3ca066056c1fa2a27c",
          "history": [
            {
              "event": "imported",
              "at": "2026-10-23T08:08:06.301710+00:00",
              "snapshot_id": "05fb577dababc0b234f241ff6272d07caa7f0b172b0c8e842fccde1bdb8e70a6"
            },
            {
              "event": "superseded",
              "at": "2026-10-23T08:08:06.314381+00:00",
              "snapshot_id": "05fb577dababc0b234f241ff6272d07caa7f0b172b0c8e842fccde1bdb8e70a6",
              "replacement": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7"
            },
            {
              "event": "imported",
              "at": "2026-10-23T08:08:06.314382+00:00",
              "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7"
            },
            {
              "event": "definitions_confirmed",
              "at": "2026-10-23T08:08:06.323276+00:00",
              "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
              "by": "合成回放：修复负责人",
              "scope": "definitions_and_declared_completeness"
            }
          ],
          "human_review": null,
          "engine_version": "bundle-review-v1",
          "markdown": "# 可进入人工发布评审\n\n主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。\n\n**接管角色：** 业务负责人\n\n**下一步：** 核对收益、预设风险边界与实施成本后，由业务负责人记录人工复核；系统不执行上线。\n\n## 口径与数据\n\n- 用户级随机；分母为全部唯一入组用户。\n- 每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款，单位 CNY。\n- 数据来源声明：synthetic。\n- 订单完整性水位：2026-09-15T00:00:00+08:00。\n- 水位由上游声明并由本地负责人确认，系统不认证其真实性。\n\n## 核心证据\n\n| 指标 | 对照 | 实验 | 绝对差值 | 差值 95% 区间 |\n| --- | ---: | ---: | ---: | --- |\n| 7 天支付用户转化率 | 10.00% | 15.00% | +5.00 个百分点 | [2.9561, 7.0439] 个百分点 |\n| 7 天支付 GMV / 用户 | ¥0.1000 | ¥0.1005 | ¥+0.0005 | [-0.0163, 0.0173] 元 / 用户 |\n\n## 预设风险边界\n\n- 每用户 GMV 最多允许损失 ¥0.0200。\n- 使用双侧 95% 差值区间保守判断；跨越允许损失边界时返回证据不足。\n- 本次只处理一个主指标与一个护栏；不等同于完整实验平台风险控制。\n\n口径确认：合成回放：修复负责人；仅为本地署名记录，不是企业身份认证或上线批准。\n\n版本：4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7 · 评审卡：406b823086adb9b34b08bd1b483cabf85514a450c8ecfa3ca066056c1fa2a27c · bundle-review-v1\n\n本卡不执行上线。撤回或数据更新后，需要重新确认当前版本。"
        }
      }
    },
    {
      "id": "missing_definition",
      "name": "分母歧义 → 补充定义",
      "description": "缺少指标分母时停下，不把曝光次数当作入组人数。",
      "inspection": {
        "status": "BLOCKED",
        "snapshot_id": "9ef1921c10827503c279a9b2bde1c40a76779ff13c65d2d94b690155b9fcd1cd",
        "inspection": {
          "snapshot_id": "9ef1921c10827503c279a9b2bde1c40a76779ff13c65d2d94b690155b9fcd1cd",
          "valid": false,
          "contract": {
            "schema_version": 1,
            "experiment_id": "synthetic-detail-page-001",
            "objective": "提升详情页 7 天支付转化率，同时限制每用户支付 GMV 损失",
            "randomization_unit": "user",
            "expected_control_ratio": 0.5,
            "enrollment_start": "2026-09-01T00:00:00+08:00",
            "enrollment_end": "2026-09-08T00:00:00+08:00",
            "observation_days": 7,
            "timezone": "Asia/Shanghai",
            "currency": "CNY",
            "conversion_event": "paid_order",
            "zero_policy": "after_watermark_only",
            "refunds": "not_deducted",
            "alpha": 0.05,
            "analysis_mode": "fixed_horizon",
            "policy": {
              "intent": "conversion_guarded",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "manifest": {
            "snapshot_at": "2026-09-16T12:00:00+08:00",
            "assignments_complete_through": "2026-09-08T00:00:00+08:00",
            "orders_complete_through": "2026-09-15T00:00:00+08:00",
            "source_evidence": "SYNTHETIC-WATERMARK-001：仅用于验证数据规则的合成完整性声明",
            "origin": "synthetic"
          },
          "counts": {},
          "issues": [
            {
              "code": "MISSING_DEFINITION",
              "message": "口径尚不完整：denominator。",
              "next_action": "请数据负责人补齐上述定义；系统不会猜测分母、事件或单位。",
              "blocking": true,
              "owner": "数据负责人"
            }
          ]
        },
        "decision": {
          "status": "BLOCKED",
          "label": "数据包需要修复",
          "reason": "口径尚不完整：denominator。"
        },
        "owner": "数据负责人",
        "next_action": "请数据负责人补齐上述定义；系统不会猜测分母、事件或单位。",
        "report": null,
        "confirmation": null,
        "card_id": "3c796ec659af8281637264852bcf7ad555d253ffc01b186a547194d9ff0a8a38",
        "history": [
          {
            "event": "imported",
            "at": "2026-10-23T08:08:06.336559+00:00",
            "snapshot_id": "9ef1921c10827503c279a9b2bde1c40a76779ff13c65d2d94b690155b9fcd1cd"
          }
        ],
        "human_review": null,
        "engine_version": "bundle-review-v1",
        "markdown": "# 数据包需要修复\n\n口径尚不完整：denominator。\n\n**接管角色：** 数据负责人\n\n**下一步：** 请数据负责人补齐上述定义；系统不会猜测分母、事件或单位。\n\n## 口径与数据\n\n- 用户级随机；分母为全部唯一入组用户。\n- 每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款，单位 CNY。\n- 数据来源声明：synthetic。\n- 订单完整性水位：2026-09-15T00:00:00+08:00。\n- 水位由上游声明并由本地负责人确认，系统不认证其真实性。\n\n## 数据处理与待办\n\n- 口径尚不完整：denominator。 接管：数据负责人。请数据负责人补齐上述定义；系统不会猜测分母、事件或单位。\n\n版本：9ef1921c10827503c279a9b2bde1c40a76779ff13c65d2d94b690155b9fcd1cd · 评审卡：3c796ec659af8281637264852bcf7ad555d253ffc01b186a547194d9ff0a8a38 · bundle-review-v1\n\n本卡不执行上线。撤回或数据更新后，需要重新确认当前版本。"
      },
      "confirmed": null,
      "recovery": {
        "inspection": {
          "status": "NEEDS_CONFIRMATION",
          "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
          "inspection": {
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
            "valid": true,
            "contract": {
              "schema_version": 1,
              "experiment_id": "synthetic-detail-page-001",
              "objective": "提升详情页 7 天支付转化率，同时限制每用户支付 GMV 损失",
              "randomization_unit": "user",
              "expected_control_ratio": 0.5,
              "enrollment_start": "2026-09-01T00:00:00+08:00",
              "enrollment_end": "2026-09-08T00:00:00+08:00",
              "observation_days": 7,
              "timezone": "Asia/Shanghai",
              "currency": "CNY",
              "conversion_event": "paid_order",
              "denominator": "all_assigned_users",
              "zero_policy": "after_watermark_only",
              "refunds": "not_deducted",
              "alpha": 0.05,
              "analysis_mode": "fixed_horizon",
              "policy": {
                "intent": "conversion_guarded",
                "max_gmv_loss_per_user": "0.02",
                "declared_at": "2026-08-31T10:00:00+08:00"
              }
            },
            "manifest": {
              "snapshot_at": "2026-09-16T12:00:00+08:00",
              "assignments_complete_through": "2026-09-08T00:00:00+08:00",
              "orders_complete_through": "2026-09-15T00:00:00+08:00",
              "source_evidence": "SYNTHETIC-WATERMARK-001：仅用于验证数据规则的合成完整性声明",
              "origin": "synthetic"
            },
            "counts": {
              "required_complete_through": "2026-09-15T00:00:00+08:00",
              "raw_assignments": 4000,
              "raw_orders": 500,
              "assigned_users": 4000,
              "control_users": 2000,
              "treatment_users": 2000,
              "unique_orders": 500,
              "included_orders": 500,
              "duplicate_orders": 0,
              "duplicate_assignments": 0,
              "excluded_orders": 0,
              "late_arriving_orders": 0
            },
            "issues": []
          },
          "decision": {
            "status": "NEEDS_CONFIRMATION",
            "label": "请先确认口径与水位",
            "reason": "分母为全部唯一入组用户；按每人入组后 7 天支付计算，只有完整性声明成立时才计零。"
          },
          "owner": "数据负责人",
          "next_action": "核对口径、上游完整性证据和去重记录，署名确认当前数据包版本。",
          "report": null,
          "confirmation": null,
          "card_id": "d5bd79d189179625f1f011b292e95dc1d4849e5d8656b0c5c625ae09942827a2",
          "history": [
            {
              "event": "imported",
              "at": "2026-10-23T08:08:06.336559+00:00",
              "snapshot_id": "9ef1921c10827503c279a9b2bde1c40a76779ff13c65d2d94b690155b9fcd1cd"
            },
            {
              "event": "superseded",
              "at": "2026-10-23T08:08:06.349424+00:00",
              "snapshot_id": "9ef1921c10827503c279a9b2bde1c40a76779ff13c65d2d94b690155b9fcd1cd",
              "replacement": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7"
            },
            {
              "event": "imported",
              "at": "2026-10-23T08:08:06.349428+00:00",
              "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7"
            }
          ],
          "human_review": null,
          "engine_version": "bundle-review-v1",
          "markdown": "# 请先确认口径与水位\n\n分母为全部唯一入组用户；按每人入组后 7 天支付计算，只有完整性声明成立时才计零。\n\n**接管角色：** 数据负责人\n\n**下一步：** 核对口径、上游完整性证据和去重记录，署名确认当前数据包版本。\n\n## 口径与数据\n\n- 用户级随机；分母为全部唯一入组用户。\n- 每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款，单位 CNY。\n- 数据来源声明：synthetic。\n- 订单完整性水位：2026-09-15T00:00:00+08:00。\n- 水位由上游声明并由本地负责人确认，系统不认证其真实性。\n\n版本：4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7 · 评审卡：d5bd79d189179625f1f011b292e95dc1d4849e5d8656b0c5c625ae09942827a2 · bundle-review-v1\n\n本卡不执行上线。撤回或数据更新后，需要重新确认当前版本。"
        },
        "confirmed": {
          "status": "REVIEW_READY",
          "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
          "inspection": {
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
            "valid": true,
            "contract": {
              "schema_version": 1,
              "experiment_id": "synthetic-detail-page-001",
              "objective": "提升详情页 7 天支付转化率，同时限制每用户支付 GMV 损失",
              "randomization_unit": "user",
              "expected_control_ratio": 0.5,
              "enrollment_start": "2026-09-01T00:00:00+08:00",
              "enrollment_end": "2026-09-08T00:00:00+08:00",
              "observation_days": 7,
              "timezone": "Asia/Shanghai",
              "currency": "CNY",
              "conversion_event": "paid_order",
              "denominator": "all_assigned_users",
              "zero_policy": "after_watermark_only",
              "refunds": "not_deducted",
              "alpha": 0.05,
              "analysis_mode": "fixed_horizon",
              "policy": {
                "intent": "conversion_guarded",
                "max_gmv_loss_per_user": "0.02",
                "declared_at": "2026-08-31T10:00:00+08:00"
              }
            },
            "manifest": {
              "snapshot_at": "2026-09-16T12:00:00+08:00",
              "assignments_complete_through": "2026-09-08T00:00:00+08:00",
              "orders_complete_through": "2026-09-15T00:00:00+08:00",
              "source_evidence": "SYNTHETIC-WATERMARK-001：仅用于验证数据规则的合成完整性声明",
              "origin": "synthetic"
            },
            "counts": {
              "required_complete_through": "2026-09-15T00:00:00+08:00",
              "raw_assignments": 4000,
              "raw_orders": 500,
              "assigned_users": 4000,
              "control_users": 2000,
              "treatment_users": 2000,
              "unique_orders": 500,
              "included_orders": 500,
              "duplicate_orders": 0,
              "duplicate_assignments": 0,
              "excluded_orders": 0,
              "late_arriving_orders": 0
            },
            "issues": []
          },
          "decision": {
            "core_ci": [
              0.029560855038664492,
              0.07043914496133549
            ],
            "gmv_ci": [
              -0.016326154309639837,
              0.017326154309639838
            ],
            "allowed_gmv_loss": 0.02,
            "policy_id": "423074f31e9d66431a31cacc03364458ded356468d43137edc678309e325f0de",
            "method": "predeclared absolute margin with two-sided 95% difference CI; one core and one guardrail",
            "status": "REVIEW_READY",
            "label": "可进入人工发布评审",
            "reason": "主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。"
          },
          "owner": "业务负责人",
          "next_action": "核对收益、预设风险边界与实施成本后，由业务负责人记录人工复核；系统不执行上线。",
          "report": {
            "status": "DONE",
            "task_type": "release_recommendation",
            "summary": "可进入人工发布评审：主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。",
            "review_gate": {
              "status": "READY",
              "checks": {
                "quality_check": "PASS",
                "metric_analysis": "PASS",
                "result_validation": "PASS"
              },
              "blockers": [],
              "owner": "实验分析负责人",
              "next_action": "必检已完成；由业务负责人结合证据与风险，确认是否进入发布评审。"
            },
            "plan": [
              {
                "name": "确认输入",
                "purpose": "确认核心指标、护栏指标和发布标准"
              },
              {
                "name": "质量检查",
                "purpose": "若实验质量异常则降低建议强度"
              },
              {
                "name": "指标判断",
                "purpose": "综合核心指标、护栏指标和风险"
              },
              {
                "name": "发布建议",
                "purpose": "给出不发布 / 灰度 / 可发布建议"
              }
            ],
            "missing_inputs": [],
            "warnings": [],
            "report_scope": {
              "source": "csv_bundle",
              "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
              "input_counts": {
                "required_complete_through": "2026-09-15T00:00:00+08:00",
                "raw_assignments": 4000,
                "raw_orders": 500,
                "assigned_users": 4000,
                "control_users": 2000,
                "treatment_users": 2000,
                "unique_orders": 500,
                "included_orders": 500,
                "duplicate_orders": 0,
                "duplicate_assignments": 0,
                "excluded_orders": 0,
                "late_arriving_orders": 0
              },
              "definition_confirmation": {
                "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
                "by": "合成回放：修复负责人",
                "at": "2026-10-23T08:08:06.358062+00:00",
                "scope": "definitions_and_declared_completeness"
              },
              "predeclared_policy": {
                "intent": "conversion_guarded",
                "max_gmv_loss_per_user": "0.02",
                "declared_at": "2026-08-31T10:00:00+08:00"
              }
            },
            "registry_entries": [],
            "quality_issues": [],
            "metric_results": [
              {
                "metric_name": "paid_user_cvr",
                "metric_kind": "conversion",
                "metric_role": "core",
                "direction": "increase",
                "control_n": 2000,
                "treatment_n": 2000,
                "control_value": 0.1,
                "treatment_value": 0.15,
                "delta_abs": 0.04999999999999999,
                "delta_rel": 0.4999999999999999,
                "p_value": 1.7449962508738146e-06,
                "ci_low": 0.029560855038664492,
                "ci_high": 0.07043914496133549,
                "significant": true,
                "statistical_method": "two_proportion_z_test_pooled; wald_ci_unpooled",
                "interpretation": "实验组相对对照组显著提升。",
                "statistical_source": "computed",
                "source_summary": "",
                "notes": ""
              },
              {
                "metric_name": "paid_gmv_per_user",
                "metric_kind": "continuous",
                "metric_role": "guardrail",
                "direction": "increase",
                "control_n": 2000,
                "treatment_n": 2000,
                "control_value": 0.1,
                "treatment_value": 0.1005,
                "delta_abs": 0.0005000000000000004,
                "delta_rel": 0.0050000000000000044,
                "p_value": 0.953544503361986,
                "ci_low": -0.016326154309639837,
                "ci_high": 0.017326154309639838,
                "significant": false,
                "statistical_method": "welch_t_test; df=3809.35",
                "interpretation": "统计上未达到显著，当前更适合表述为未形成足够证据。",
                "statistical_source": "computed",
                "source_summary": "",
                "notes": ""
              }
            ],
            "segment_findings": [],
            "facts": [
              {
                "label": "paid_user_cvr 指标结果",
                "evidence": "paid_user_cvr 对照 0.1000，实验 0.1500，绝对变化 0.0500，p=0.0000",
                "strength": "事实"
              },
              {
                "label": "paid_gmv_per_user 指标结果",
                "evidence": "paid_gmv_per_user 对照 0.1000，实验 0.1005，绝对变化 0.0005，p=0.9535",
                "strength": "事实"
              }
            ],
            "inferences": [
              {
                "label": "paid_user_cvr 方向判断",
                "evidence": "实验组相对对照组显著提升。",
                "strength": "合理推断"
              }
            ],
            "hypotheses": [],
            "recommendations": [
              {
                "label": "可进入人工发布评审",
                "reason": "主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。"
              }
            ],
            "selected_skills": [
              "quality_check",
              "experiment_recap",
              "release_recommendation"
            ],
            "agent_trace": [
              {
                "tool_name": "check_quality",
                "input": {
                  "request": {
                    "type": "ExperimentRequest"
                  }
                },
                "output": {
                  "summary": {
                    "type": "list",
                    "count": 0
                  }
                },
                "status": "ok",
                "latency_ms": 0.01,
                "error": ""
              },
              {
                "tool_name": "analyze_metric",
                "input": {
                  "metrics": {
                    "type": "list",
                    "count": 2
                  },
                  "alpha": 0.05
                },
                "output": {
                  "summary": {
                    "type": "list",
                    "count": 2
                  }
                },
                "status": "ok",
                "latency_ms": 0.12,
                "error": ""
              },
              {
                "tool_name": "make_recommendation",
                "input": {
                  "metric_results": {
                    "type": "list",
                    "count": 2
                  },
                  "quality_issues": {
                    "type": "list",
                    "count": 0
                  }
                },
                "output": {
                  "summary": {
                    "type": "list",
                    "count": 2
                  }
                },
                "status": "ok",
                "latency_ms": 0.0,
                "error": ""
              }
            ],
            "workflow_trace": [
              {
                "stage": "planner",
                "status": "ok",
                "detail": {
                  "skills": [
                    "quality_check",
                    "experiment_recap",
                    "release_recommendation"
                  ],
                  "tools": [
                    "check_quality",
                    "analyze_metric",
                    "make_recommendation"
                  ]
                }
              },
              {
                "stage": "input_validation",
                "status": "ok",
                "detail": {
                  "missing_inputs": []
                }
              },
              {
                "stage": "skill:quality_check",
                "status": "ok",
                "detail": {}
              },
              {
                "stage": "skill:experiment_recap",
                "status": "ok",
                "detail": {}
              },
              {
                "stage": "result_validation",
                "status": "ok",
                "detail": {
                  "check_status": "PASS",
                  "warning_count": 0
                }
              },
              {
                "stage": "skill:release_recommendation",
                "status": "ok",
                "detail": {}
              },
              {
                "stage": "guardrails",
                "status": "ok",
                "detail": {
                  "review_status": "READY",
                  "checks": {
                    "quality_check": "PASS",
                    "metric_analysis": "PASS",
                    "result_validation": "PASS"
                  }
                }
              },
              {
                "stage": "report_generation",
                "status": "ok",
                "detail": {}
              },
              {
                "stage": "risk_policy",
                "status": "REVIEW_READY",
                "detail": {
                  "policy_id": "423074f31e9d66431a31cacc03364458ded356468d43137edc678309e325f0de",
                  "intent": "conversion_guarded"
                }
              }
            ]
          },
          "confirmation": {
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
            "by": "合成回放：修复负责人",
            "at": "2026-10-23T08:08:06.358062+00:00",
            "scope": "definitions_and_declared_completeness"
          },
          "card_id": "406b823086adb9b34b08bd1b483cabf85514a450c8ecfa3ca066056c1fa2a27c",
          "history": [
            {
              "event": "imported",
              "at": "2026-10-23T08:08:06.336559+00:00",
              "snapshot_id": "9ef1921c10827503c279a9b2bde1c40a76779ff13c65d2d94b690155b9fcd1cd"
            },
            {
              "event": "superseded",
              "at": "2026-10-23T08:08:06.349424+00:00",
              "snapshot_id": "9ef1921c10827503c279a9b2bde1c40a76779ff13c65d2d94b690155b9fcd1cd",
              "replacement": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7"
            },
            {
              "event": "imported",
              "at": "2026-10-23T08:08:06.349428+00:00",
              "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7"
            },
            {
              "event": "definitions_confirmed",
              "at": "2026-10-23T08:08:06.358062+00:00",
              "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
              "by": "合成回放：修复负责人",
              "scope": "definitions_and_declared_completeness"
            }
          ],
          "human_review": null,
          "engine_version": "bundle-review-v1",
          "markdown": "# 可进入人工发布评审\n\n主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。\n\n**接管角色：** 业务负责人\n\n**下一步：** 核对收益、预设风险边界与实施成本后，由业务负责人记录人工复核；系统不执行上线。\n\n## 口径与数据\n\n- 用户级随机；分母为全部唯一入组用户。\n- 每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款，单位 CNY。\n- 数据来源声明：synthetic。\n- 订单完整性水位：2026-09-15T00:00:00+08:00。\n- 水位由上游声明并由本地负责人确认，系统不认证其真实性。\n\n## 核心证据\n\n| 指标 | 对照 | 实验 | 绝对差值 | 差值 95% 区间 |\n| --- | ---: | ---: | ---: | --- |\n| 7 天支付用户转化率 | 10.00% | 15.00% | +5.00 个百分点 | [2.9561, 7.0439] 个百分点 |\n| 7 天支付 GMV / 用户 | ¥0.1000 | ¥0.1005 | ¥+0.0005 | [-0.0163, 0.0173] 元 / 用户 |\n\n## 预设风险边界\n\n- 每用户 GMV 最多允许损失 ¥0.0200。\n- 使用双侧 95% 差值区间保守判断；跨越允许损失边界时返回证据不足。\n- 本次只处理一个主指标与一个护栏；不等同于完整实验平台风险控制。\n\n口径确认：合成回放：修复负责人；仅为本地署名记录，不是企业身份认证或上线批准。\n\n版本：4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7 · 评审卡：406b823086adb9b34b08bd1b483cabf85514a450c8ecfa3ca066056c1fa2a27c · bundle-review-v1\n\n本卡不执行上线。撤回或数据更新后，需要重新确认当前版本。"
        }
      }
    },
    {
      "id": "guardrail_harm",
      "name": "收益与护栏冲突",
      "description": "主指标提升，也不能越过事先约定的支付 GMV 损失边界。",
      "inspection": {
        "status": "NEEDS_CONFIRMATION",
        "snapshot_id": "1db2bb7885009bb275aa5ffa558cafbc9e41204e67ff95b76b31d34816565093",
        "inspection": {
          "snapshot_id": "1db2bb7885009bb275aa5ffa558cafbc9e41204e67ff95b76b31d34816565093",
          "valid": true,
          "contract": {
            "schema_version": 1,
            "experiment_id": "synthetic-detail-page-001",
            "objective": "提升详情页 7 天支付转化率，同时限制每用户支付 GMV 损失",
            "randomization_unit": "user",
            "expected_control_ratio": 0.5,
            "enrollment_start": "2026-09-01T00:00:00+08:00",
            "enrollment_end": "2026-09-08T00:00:00+08:00",
            "observation_days": 7,
            "timezone": "Asia/Shanghai",
            "currency": "CNY",
            "conversion_event": "paid_order",
            "denominator": "all_assigned_users",
            "zero_policy": "after_watermark_only",
            "refunds": "not_deducted",
            "alpha": 0.05,
            "analysis_mode": "fixed_horizon",
            "policy": {
              "intent": "conversion_guarded",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "manifest": {
            "snapshot_at": "2026-09-16T12:00:00+08:00",
            "assignments_complete_through": "2026-09-08T00:00:00+08:00",
            "orders_complete_through": "2026-09-15T00:00:00+08:00",
            "source_evidence": "SYNTHETIC-WATERMARK-001：仅用于验证数据规则的合成完整性声明",
            "origin": "synthetic"
          },
          "counts": {
            "required_complete_through": "2026-09-15T00:00:00+08:00",
            "raw_assignments": 4000,
            "raw_orders": 500,
            "assigned_users": 4000,
            "control_users": 2000,
            "treatment_users": 2000,
            "unique_orders": 500,
            "included_orders": 500,
            "duplicate_orders": 0,
            "duplicate_assignments": 0,
            "excluded_orders": 0,
            "late_arriving_orders": 0
          },
          "issues": []
        },
        "decision": {
          "status": "NEEDS_CONFIRMATION",
          "label": "请先确认口径与水位",
          "reason": "分母为全部唯一入组用户；按每人入组后 7 天支付计算，只有完整性声明成立时才计零。"
        },
        "owner": "数据负责人",
        "next_action": "核对口径、上游完整性证据和去重记录，署名确认当前数据包版本。",
        "report": null,
        "confirmation": null,
        "card_id": "f567f80e17acf010137548811099aba45e2163e69050f0e539f023c348de2349",
        "history": [
          {
            "event": "imported",
            "at": "2026-10-23T08:08:06.379824+00:00",
            "snapshot_id": "1db2bb7885009bb275aa5ffa558cafbc9e41204e67ff95b76b31d34816565093"
          }
        ],
        "human_review": null,
        "engine_version": "bundle-review-v1",
        "markdown": "# 请先确认口径与水位\n\n分母为全部唯一入组用户；按每人入组后 7 天支付计算，只有完整性声明成立时才计零。\n\n**接管角色：** 数据负责人\n\n**下一步：** 核对口径、上游完整性证据和去重记录，署名确认当前数据包版本。\n\n## 口径与数据\n\n- 用户级随机；分母为全部唯一入组用户。\n- 每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款，单位 CNY。\n- 数据来源声明：synthetic。\n- 订单完整性水位：2026-09-15T00:00:00+08:00。\n- 水位由上游声明并由本地负责人确认，系统不认证其真实性。\n\n版本：1db2bb7885009bb275aa5ffa558cafbc9e41204e67ff95b76b31d34816565093 · 评审卡：f567f80e17acf010137548811099aba45e2163e69050f0e539f023c348de2349 · bundle-review-v1\n\n本卡不执行上线。撤回或数据更新后，需要重新确认当前版本。"
      },
      "confirmed": {
        "status": "DO_NOT_SHIP",
        "snapshot_id": "1db2bb7885009bb275aa5ffa558cafbc9e41204e67ff95b76b31d34816565093",
        "inspection": {
          "snapshot_id": "1db2bb7885009bb275aa5ffa558cafbc9e41204e67ff95b76b31d34816565093",
          "valid": true,
          "contract": {
            "schema_version": 1,
            "experiment_id": "synthetic-detail-page-001",
            "objective": "提升详情页 7 天支付转化率，同时限制每用户支付 GMV 损失",
            "randomization_unit": "user",
            "expected_control_ratio": 0.5,
            "enrollment_start": "2026-09-01T00:00:00+08:00",
            "enrollment_end": "2026-09-08T00:00:00+08:00",
            "observation_days": 7,
            "timezone": "Asia/Shanghai",
            "currency": "CNY",
            "conversion_event": "paid_order",
            "denominator": "all_assigned_users",
            "zero_policy": "after_watermark_only",
            "refunds": "not_deducted",
            "alpha": 0.05,
            "analysis_mode": "fixed_horizon",
            "policy": {
              "intent": "conversion_guarded",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "manifest": {
            "snapshot_at": "2026-09-16T12:00:00+08:00",
            "assignments_complete_through": "2026-09-08T00:00:00+08:00",
            "orders_complete_through": "2026-09-15T00:00:00+08:00",
            "source_evidence": "SYNTHETIC-WATERMARK-001：仅用于验证数据规则的合成完整性声明",
            "origin": "synthetic"
          },
          "counts": {
            "required_complete_through": "2026-09-15T00:00:00+08:00",
            "raw_assignments": 4000,
            "raw_orders": 500,
            "assigned_users": 4000,
            "control_users": 2000,
            "treatment_users": 2000,
            "unique_orders": 500,
            "included_orders": 500,
            "duplicate_orders": 0,
            "duplicate_assignments": 0,
            "excluded_orders": 0,
            "late_arriving_orders": 0
          },
          "issues": []
        },
        "decision": {
          "core_ci": [
            0.029560855038664492,
            0.07043914496133549
          ],
          "gmv_ci": [
            -0.05457169269846474,
            -0.02542830730153526
          ],
          "allowed_gmv_loss": 0.02,
          "policy_id": "423074f31e9d66431a31cacc03364458ded356468d43137edc678309e325f0de",
          "method": "predeclared absolute margin with two-sided 95% difference CI; one core and one guardrail",
          "status": "DO_NOT_SHIP",
          "label": "不支持推进发布",
          "reason": "主指标有明确损害，或 GMV 损失区间超过预先约定的允许边界。"
        },
        "owner": "业务负责人",
        "next_action": "停止推进当前方案，修订设计后建立新实验，不通过修改阈值覆盖当前结果。",
        "report": {
          "status": "DONE_WITH_CONCERNS",
          "task_type": "release_recommendation",
          "summary": "不支持推进发布：主指标有明确损害，或 GMV 损失区间超过预先约定的允许边界。",
          "review_gate": {
            "status": "READY",
            "checks": {
              "quality_check": "PASS",
              "metric_analysis": "PASS",
              "result_validation": "PASS"
            },
            "blockers": [],
            "owner": "实验分析负责人",
            "next_action": "必检已完成；由业务负责人结合证据与风险，确认是否进入发布评审。"
          },
          "plan": [
            {
              "name": "确认输入",
              "purpose": "确认核心指标、护栏指标和发布标准"
            },
            {
              "name": "质量检查",
              "purpose": "若实验质量异常则降低建议强度"
            },
            {
              "name": "指标判断",
              "purpose": "综合核心指标、护栏指标和风险"
            },
            {
              "name": "发布建议",
              "purpose": "给出不发布 / 灰度 / 可发布建议"
            }
          ],
          "missing_inputs": [],
          "warnings": [],
          "report_scope": {
            "source": "csv_bundle",
            "snapshot_id": "1db2bb7885009bb275aa5ffa558cafbc9e41204e67ff95b76b31d34816565093",
            "input_counts": {
              "required_complete_through": "2026-09-15T00:00:00+08:00",
              "raw_assignments": 4000,
              "raw_orders": 500,
              "assigned_users": 4000,
              "control_users": 2000,
              "treatment_users": 2000,
              "unique_orders": 500,
              "included_orders": 500,
              "duplicate_orders": 0,
              "duplicate_assignments": 0,
              "excluded_orders": 0,
              "late_arriving_orders": 0
            },
            "definition_confirmation": {
              "snapshot_id": "1db2bb7885009bb275aa5ffa558cafbc9e41204e67ff95b76b31d34816565093",
              "by": "合成回放：数据负责人",
              "at": "2026-10-23T08:08:06.388773+00:00",
              "scope": "definitions_and_declared_completeness"
            },
            "predeclared_policy": {
              "intent": "conversion_guarded",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "registry_entries": [],
          "quality_issues": [],
          "metric_results": [
            {
              "metric_name": "paid_user_cvr",
              "metric_kind": "conversion",
              "metric_role": "core",
              "direction": "increase",
              "control_n": 2000,
              "treatment_n": 2000,
              "control_value": 0.1,
              "treatment_value": 0.15,
              "delta_abs": 0.04999999999999999,
              "delta_rel": 0.4999999999999999,
              "p_value": 1.7449962508738146e-06,
              "ci_low": 0.029560855038664492,
              "ci_high": 0.07043914496133549,
              "significant": true,
              "statistical_method": "two_proportion_z_test_pooled; wald_ci_unpooled",
              "interpretation": "实验组相对对照组显著提升。",
              "statistical_source": "computed",
              "source_summary": "",
              "notes": ""
            },
            {
              "metric_name": "paid_gmv_per_user",
              "metric_kind": "continuous",
              "metric_role": "guardrail",
              "direction": "increase",
              "control_n": 2000,
              "treatment_n": 2000,
              "control_value": 0.1,
              "treatment_value": 0.060000000000000005,
              "delta_abs": -0.04,
              "delta_rel": -0.39999999999999997,
              "p_value": 7.941528750250561e-08,
              "ci_low": -0.05457169269846474,
              "ci_high": -0.02542830730153526,
              "significant": true,
              "statistical_method": "welch_t_test; df=2860.93",
              "interpretation": "实验组出现显著变化，但方向不符合预期。",
              "statistical_source": "computed",
              "source_summary": "",
              "notes": ""
            }
          ],
          "segment_findings": [],
          "facts": [
            {
              "label": "paid_user_cvr 指标结果",
              "evidence": "paid_user_cvr 对照 0.1000，实验 0.1500，绝对变化 0.0500，p=0.0000",
              "strength": "事实"
            },
            {
              "label": "paid_gmv_per_user 指标结果",
              "evidence": "paid_gmv_per_user 对照 0.1000，实验 0.0600，绝对变化 -0.0400，p=0.0000",
              "strength": "事实"
            }
          ],
          "inferences": [
            {
              "label": "paid_user_cvr 方向判断",
              "evidence": "实验组相对对照组显著提升。",
              "strength": "合理推断"
            },
            {
              "label": "paid_gmv_per_user 方向判断",
              "evidence": "实验组出现显著变化，但方向不符合预期。",
              "strength": "合理推断"
            }
          ],
          "hypotheses": [],
          "recommendations": [
            {
              "label": "不支持推进发布",
              "reason": "主指标有明确损害，或 GMV 损失区间超过预先约定的允许边界。"
            }
          ],
          "selected_skills": [
            "quality_check",
            "experiment_recap",
            "release_recommendation"
          ],
          "agent_trace": [
            {
              "tool_name": "check_quality",
              "input": {
                "request": {
                  "type": "ExperimentRequest"
                }
              },
              "output": {
                "summary": {
                  "type": "list",
                  "count": 0
                }
              },
              "status": "ok",
              "latency_ms": 0.01,
              "error": ""
            },
            {
              "tool_name": "analyze_metric",
              "input": {
                "metrics": {
                  "type": "list",
                  "count": 2
                },
                "alpha": 0.05
              },
              "output": {
                "summary": {
                  "type": "list",
                  "count": 2
                }
              },
              "status": "ok",
              "latency_ms": 0.12,
              "error": ""
            },
            {
              "tool_name": "make_recommendation",
              "input": {
                "metric_results": {
                  "type": "list",
                  "count": 2
                },
                "quality_issues": {
                  "type": "list",
                  "count": 0
                }
              },
              "output": {
                "summary": {
                  "type": "list",
                  "count": 2
                }
              },
              "status": "ok",
              "latency_ms": 0.0,
              "error": ""
            }
          ],
          "workflow_trace": [
            {
              "stage": "planner",
              "status": "ok",
              "detail": {
                "skills": [
                  "quality_check",
                  "experiment_recap",
                  "release_recommendation"
                ],
                "tools": [
                  "check_quality",
                  "analyze_metric",
                  "make_recommendation"
                ]
              }
            },
            {
              "stage": "input_validation",
              "status": "ok",
              "detail": {
                "missing_inputs": []
              }
            },
            {
              "stage": "skill:quality_check",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "skill:experiment_recap",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "result_validation",
              "status": "ok",
              "detail": {
                "check_status": "PASS",
                "warning_count": 0
              }
            },
            {
              "stage": "skill:release_recommendation",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "guardrails",
              "status": "ok",
              "detail": {
                "review_status": "READY",
                "checks": {
                  "quality_check": "PASS",
                  "metric_analysis": "PASS",
                  "result_validation": "PASS"
                }
              }
            },
            {
              "stage": "report_generation",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "risk_policy",
              "status": "DO_NOT_SHIP",
              "detail": {
                "policy_id": "423074f31e9d66431a31cacc03364458ded356468d43137edc678309e325f0de",
                "intent": "conversion_guarded"
              }
            }
          ]
        },
        "confirmation": {
          "snapshot_id": "1db2bb7885009bb275aa5ffa558cafbc9e41204e67ff95b76b31d34816565093",
          "by": "合成回放：数据负责人",
          "at": "2026-10-23T08:08:06.388773+00:00",
          "scope": "definitions_and_declared_completeness"
        },
        "card_id": "1c4135a30fd0253e13e5481ff060af446875ac7cca65c7766815ba62890aabae",
        "history": [
          {
            "event": "imported",
            "at": "2026-10-23T08:08:06.379824+00:00",
            "snapshot_id": "1db2bb7885009bb275aa5ffa558cafbc9e41204e67ff95b76b31d34816565093"
          },
          {
            "event": "definitions_confirmed",
            "at": "2026-10-23T08:08:06.388773+00:00",
            "snapshot_id": "1db2bb7885009bb275aa5ffa558cafbc9e41204e67ff95b76b31d34816565093",
            "by": "合成回放：数据负责人",
            "scope": "definitions_and_declared_completeness"
          }
        ],
        "human_review": null,
        "engine_version": "bundle-review-v1",
        "markdown": "# 不支持推进发布\n\n主指标有明确损害，或 GMV 损失区间超过预先约定的允许边界。\n\n**接管角色：** 业务负责人\n\n**下一步：** 停止推进当前方案，修订设计后建立新实验，不通过修改阈值覆盖当前结果。\n\n## 口径与数据\n\n- 用户级随机；分母为全部唯一入组用户。\n- 每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款，单位 CNY。\n- 数据来源声明：synthetic。\n- 订单完整性水位：2026-09-15T00:00:00+08:00。\n- 水位由上游声明并由本地负责人确认，系统不认证其真实性。\n\n## 核心证据\n\n| 指标 | 对照 | 实验 | 绝对差值 | 差值 95% 区间 |\n| --- | ---: | ---: | ---: | --- |\n| 7 天支付用户转化率 | 10.00% | 15.00% | +5.00 个百分点 | [2.9561, 7.0439] 个百分点 |\n| 7 天支付 GMV / 用户 | ¥0.1000 | ¥0.0600 | ¥-0.0400 | [-0.0546, -0.0254] 元 / 用户 |\n\n## 预设风险边界\n\n- 每用户 GMV 最多允许损失 ¥0.0200。\n- 使用双侧 95% 差值区间保守判断；跨越允许损失边界时返回证据不足。\n- 本次只处理一个主指标与一个护栏；不等同于完整实验平台风险控制。\n\n口径确认：合成回放：数据负责人；仅为本地署名记录，不是企业身份认证或上线批准。\n\n版本：1db2bb7885009bb275aa5ffa558cafbc9e41204e67ff95b76b31d34816565093 · 评审卡：1c4135a30fd0253e13e5481ff060af446875ac7cca65c7766815ba62890aabae · bundle-review-v1\n\n本卡不执行上线。撤回或数据更新后，需要重新确认当前版本。"
      },
      "recovery": null
    },
    {
      "id": "guardrail_uncertain",
      "name": "护栏证据不足",
      "description": "没有显著恶化，不等于已经证明损失可接受。",
      "inspection": {
        "status": "NEEDS_CONFIRMATION",
        "snapshot_id": "1490d897c9728a1b83186f87f165a249e4eed928c9db91b0befd94d085115c5c",
        "inspection": {
          "snapshot_id": "1490d897c9728a1b83186f87f165a249e4eed928c9db91b0befd94d085115c5c",
          "valid": true,
          "contract": {
            "schema_version": 1,
            "experiment_id": "synthetic-detail-page-001",
            "objective": "提升详情页 7 天支付转化率，同时限制每用户支付 GMV 损失",
            "randomization_unit": "user",
            "expected_control_ratio": 0.5,
            "enrollment_start": "2026-09-01T00:00:00+08:00",
            "enrollment_end": "2026-09-08T00:00:00+08:00",
            "observation_days": 7,
            "timezone": "Asia/Shanghai",
            "currency": "CNY",
            "conversion_event": "paid_order",
            "denominator": "all_assigned_users",
            "zero_policy": "after_watermark_only",
            "refunds": "not_deducted",
            "alpha": 0.05,
            "analysis_mode": "fixed_horizon",
            "policy": {
              "intent": "conversion_guarded",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "manifest": {
            "snapshot_at": "2026-09-16T12:00:00+08:00",
            "assignments_complete_through": "2026-09-08T00:00:00+08:00",
            "orders_complete_through": "2026-09-15T00:00:00+08:00",
            "source_evidence": "SYNTHETIC-WATERMARK-001：仅用于验证数据规则的合成完整性声明",
            "origin": "synthetic"
          },
          "counts": {
            "required_complete_through": "2026-09-15T00:00:00+08:00",
            "raw_assignments": 4000,
            "raw_orders": 500,
            "assigned_users": 4000,
            "control_users": 2000,
            "treatment_users": 2000,
            "unique_orders": 500,
            "included_orders": 500,
            "duplicate_orders": 0,
            "duplicate_assignments": 0,
            "excluded_orders": 0,
            "late_arriving_orders": 0
          },
          "issues": []
        },
        "decision": {
          "status": "NEEDS_CONFIRMATION",
          "label": "请先确认口径与水位",
          "reason": "分母为全部唯一入组用户；按每人入组后 7 天支付计算，只有完整性声明成立时才计零。"
        },
        "owner": "数据负责人",
        "next_action": "核对口径、上游完整性证据和去重记录，署名确认当前数据包版本。",
        "report": null,
        "confirmation": null,
        "card_id": "b16281b642d0aefe2b8ddeee3d774b25bff83998237e57e8a4f66c38e443a803",
        "history": [
          {
            "event": "imported",
            "at": "2026-10-23T08:08:06.410540+00:00",
            "snapshot_id": "1490d897c9728a1b83186f87f165a249e4eed928c9db91b0befd94d085115c5c"
          }
        ],
        "human_review": null,
        "engine_version": "bundle-review-v1",
        "markdown": "# 请先确认口径与水位\n\n分母为全部唯一入组用户；按每人入组后 7 天支付计算，只有完整性声明成立时才计零。\n\n**接管角色：** 数据负责人\n\n**下一步：** 核对口径、上游完整性证据和去重记录，署名确认当前数据包版本。\n\n## 口径与数据\n\n- 用户级随机；分母为全部唯一入组用户。\n- 每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款，单位 CNY。\n- 数据来源声明：synthetic。\n- 订单完整性水位：2026-09-15T00:00:00+08:00。\n- 水位由上游声明并由本地负责人确认，系统不认证其真实性。\n\n版本：1490d897c9728a1b83186f87f165a249e4eed928c9db91b0befd94d085115c5c · 评审卡：b16281b642d0aefe2b8ddeee3d774b25bff83998237e57e8a4f66c38e443a803 · bundle-review-v1\n\n本卡不执行上线。撤回或数据更新后，需要重新确认当前版本。"
      },
      "confirmed": {
        "status": "INCONCLUSIVE",
        "snapshot_id": "1490d897c9728a1b83186f87f165a249e4eed928c9db91b0befd94d085115c5c",
        "inspection": {
          "snapshot_id": "1490d897c9728a1b83186f87f165a249e4eed928c9db91b0befd94d085115c5c",
          "valid": true,
          "contract": {
            "schema_version": 1,
            "experiment_id": "synthetic-detail-page-001",
            "objective": "提升详情页 7 天支付转化率，同时限制每用户支付 GMV 损失",
            "randomization_unit": "user",
            "expected_control_ratio": 0.5,
            "enrollment_start": "2026-09-01T00:00:00+08:00",
            "enrollment_end": "2026-09-08T00:00:00+08:00",
            "observation_days": 7,
            "timezone": "Asia/Shanghai",
            "currency": "CNY",
            "conversion_event": "paid_order",
            "denominator": "all_assigned_users",
            "zero_policy": "after_watermark_only",
            "refunds": "not_deducted",
            "alpha": 0.05,
            "analysis_mode": "fixed_horizon",
            "policy": {
              "intent": "conversion_guarded",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "manifest": {
            "snapshot_at": "2026-09-16T12:00:00+08:00",
            "assignments_complete_through": "2026-09-08T00:00:00+08:00",
            "orders_complete_through": "2026-09-15T00:00:00+08:00",
            "source_evidence": "SYNTHETIC-WATERMARK-001：仅用于验证数据规则的合成完整性声明",
            "origin": "synthetic"
          },
          "counts": {
            "required_complete_through": "2026-09-15T00:00:00+08:00",
            "raw_assignments": 4000,
            "raw_orders": 500,
            "assigned_users": 4000,
            "control_users": 2000,
            "treatment_users": 2000,
            "unique_orders": 500,
            "included_orders": 500,
            "duplicate_orders": 0,
            "duplicate_assignments": 0,
            "excluded_orders": 0,
            "late_arriving_orders": 0
          },
          "issues": []
        },
        "decision": {
          "core_ci": [
            0.029560855038664492,
            0.07043914496133549
          ],
          "gmv_ci": [
            -0.03322396070377115,
            -0.0017760392962288506
          ],
          "allowed_gmv_loss": 0.02,
          "policy_id": "423074f31e9d66431a31cacc03364458ded356468d43137edc678309e325f0de",
          "method": "predeclared absolute margin with two-sided 95% difference CI; one core and one guardrail",
          "status": "INCONCLUSIVE",
          "label": "护栏证据不足",
          "reason": "尚不能排除超出允许损失；未显著恶化不等于安全。"
        },
        "owner": "业务负责人",
        "next_action": "记录证据不足，按预设计划结束本次判断；如需新实验，重新制定样本与风险计划。",
        "report": {
          "status": "DONE_WITH_CONCERNS",
          "task_type": "release_recommendation",
          "summary": "护栏证据不足：尚不能排除超出允许损失；未显著恶化不等于安全。",
          "review_gate": {
            "status": "READY",
            "checks": {
              "quality_check": "PASS",
              "metric_analysis": "PASS",
              "result_validation": "PASS"
            },
            "blockers": [],
            "owner": "实验分析负责人",
            "next_action": "必检已完成；由业务负责人结合证据与风险，确认是否进入发布评审。"
          },
          "plan": [
            {
              "name": "确认输入",
              "purpose": "确认核心指标、护栏指标和发布标准"
            },
            {
              "name": "质量检查",
              "purpose": "若实验质量异常则降低建议强度"
            },
            {
              "name": "指标判断",
              "purpose": "综合核心指标、护栏指标和风险"
            },
            {
              "name": "发布建议",
              "purpose": "给出不发布 / 灰度 / 可发布建议"
            }
          ],
          "missing_inputs": [],
          "warnings": [],
          "report_scope": {
            "source": "csv_bundle",
            "snapshot_id": "1490d897c9728a1b83186f87f165a249e4eed928c9db91b0befd94d085115c5c",
            "input_counts": {
              "required_complete_through": "2026-09-15T00:00:00+08:00",
              "raw_assignments": 4000,
              "raw_orders": 500,
              "assigned_users": 4000,
              "control_users": 2000,
              "treatment_users": 2000,
              "unique_orders": 500,
              "included_orders": 500,
              "duplicate_orders": 0,
              "duplicate_assignments": 0,
              "excluded_orders": 0,
              "late_arriving_orders": 0
            },
            "definition_confirmation": {
              "snapshot_id": "1490d897c9728a1b83186f87f165a249e4eed928c9db91b0befd94d085115c5c",
              "by": "合成回放：数据负责人",
              "at": "2026-10-23T08:08:06.419421+00:00",
              "scope": "definitions_and_declared_completeness"
            },
            "predeclared_policy": {
              "intent": "conversion_guarded",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "registry_entries": [],
          "quality_issues": [],
          "metric_results": [
            {
              "metric_name": "paid_user_cvr",
              "metric_kind": "conversion",
              "metric_role": "core",
              "direction": "increase",
              "control_n": 2000,
              "treatment_n": 2000,
              "control_value": 0.1,
              "treatment_value": 0.15,
              "delta_abs": 0.04999999999999999,
              "delta_rel": 0.4999999999999999,
              "p_value": 1.7449962508738146e-06,
              "ci_low": 0.029560855038664492,
              "ci_high": 0.07043914496133549,
              "significant": true,
              "statistical_method": "two_proportion_z_test_pooled; wald_ci_unpooled",
              "interpretation": "实验组相对对照组显著提升。",
              "statistical_source": "computed",
              "source_summary": "",
              "notes": ""
            },
            {
              "metric_name": "paid_gmv_per_user",
              "metric_kind": "continuous",
              "metric_role": "guardrail",
              "direction": "increase",
              "control_n": 2000,
              "treatment_n": 2000,
              "control_value": 0.1,
              "treatment_value": 0.0825,
              "delta_abs": -0.0175,
              "delta_rel": -0.17500000000000002,
              "p_value": 0.029168690136794212,
              "ci_low": -0.03322396070377115,
              "ci_high": -0.0017760392962288506,
              "significant": true,
              "statistical_method": "welch_t_test; df=3446.48",
              "interpretation": "实验组出现显著变化，但方向不符合预期。",
              "statistical_source": "computed",
              "source_summary": "",
              "notes": ""
            }
          ],
          "segment_findings": [],
          "facts": [
            {
              "label": "paid_user_cvr 指标结果",
              "evidence": "paid_user_cvr 对照 0.1000，实验 0.1500，绝对变化 0.0500，p=0.0000",
              "strength": "事实"
            },
            {
              "label": "paid_gmv_per_user 指标结果",
              "evidence": "paid_gmv_per_user 对照 0.1000，实验 0.0825，绝对变化 -0.0175，p=0.0292",
              "strength": "事实"
            }
          ],
          "inferences": [
            {
              "label": "paid_user_cvr 方向判断",
              "evidence": "实验组相对对照组显著提升。",
              "strength": "合理推断"
            },
            {
              "label": "paid_gmv_per_user 方向判断",
              "evidence": "实验组出现显著变化，但方向不符合预期。",
              "strength": "合理推断"
            }
          ],
          "hypotheses": [],
          "recommendations": [
            {
              "label": "护栏证据不足",
              "reason": "尚不能排除超出允许损失；未显著恶化不等于安全。"
            }
          ],
          "selected_skills": [
            "quality_check",
            "experiment_recap",
            "release_recommendation"
          ],
          "agent_trace": [
            {
              "tool_name": "check_quality",
              "input": {
                "request": {
                  "type": "ExperimentRequest"
                }
              },
              "output": {
                "summary": {
                  "type": "list",
                  "count": 0
                }
              },
              "status": "ok",
              "latency_ms": 0.01,
              "error": ""
            },
            {
              "tool_name": "analyze_metric",
              "input": {
                "metrics": {
                  "type": "list",
                  "count": 2
                },
                "alpha": 0.05
              },
              "output": {
                "summary": {
                  "type": "list",
                  "count": 2
                }
              },
              "status": "ok",
              "latency_ms": 0.16,
              "error": ""
            },
            {
              "tool_name": "make_recommendation",
              "input": {
                "metric_results": {
                  "type": "list",
                  "count": 2
                },
                "quality_issues": {
                  "type": "list",
                  "count": 0
                }
              },
              "output": {
                "summary": {
                  "type": "list",
                  "count": 2
                }
              },
              "status": "ok",
              "latency_ms": 0.0,
              "error": ""
            }
          ],
          "workflow_trace": [
            {
              "stage": "planner",
              "status": "ok",
              "detail": {
                "skills": [
                  "quality_check",
                  "experiment_recap",
                  "release_recommendation"
                ],
                "tools": [
                  "check_quality",
                  "analyze_metric",
                  "make_recommendation"
                ]
              }
            },
            {
              "stage": "input_validation",
              "status": "ok",
              "detail": {
                "missing_inputs": []
              }
            },
            {
              "stage": "skill:quality_check",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "skill:experiment_recap",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "result_validation",
              "status": "ok",
              "detail": {
                "check_status": "PASS",
                "warning_count": 0
              }
            },
            {
              "stage": "skill:release_recommendation",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "guardrails",
              "status": "ok",
              "detail": {
                "review_status": "READY",
                "checks": {
                  "quality_check": "PASS",
                  "metric_analysis": "PASS",
                  "result_validation": "PASS"
                }
              }
            },
            {
              "stage": "report_generation",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "risk_policy",
              "status": "INCONCLUSIVE",
              "detail": {
                "policy_id": "423074f31e9d66431a31cacc03364458ded356468d43137edc678309e325f0de",
                "intent": "conversion_guarded"
              }
            }
          ]
        },
        "confirmation": {
          "snapshot_id": "1490d897c9728a1b83186f87f165a249e4eed928c9db91b0befd94d085115c5c",
          "by": "合成回放：数据负责人",
          "at": "2026-10-23T08:08:06.419421+00:00",
          "scope": "definitions_and_declared_completeness"
        },
        "card_id": "dc086121979548c2266f8a99bca47acbfcdbc3b0fc0f42acfc2bfe580e58d4d5",
        "history": [
          {
            "event": "imported",
            "at": "2026-10-23T08:08:06.410540+00:00",
            "snapshot_id": "1490d897c9728a1b83186f87f165a249e4eed928c9db91b0befd94d085115c5c"
          },
          {
            "event": "definitions_confirmed",
            "at": "2026-10-23T08:08:06.419421+00:00",
            "snapshot_id": "1490d897c9728a1b83186f87f165a249e4eed928c9db91b0befd94d085115c5c",
            "by": "合成回放：数据负责人",
            "scope": "definitions_and_declared_completeness"
          }
        ],
        "human_review": null,
        "engine_version": "bundle-review-v1",
        "markdown": "# 护栏证据不足\n\n尚不能排除超出允许损失；未显著恶化不等于安全。\n\n**接管角色：** 业务负责人\n\n**下一步：** 记录证据不足，按预设计划结束本次判断；如需新实验，重新制定样本与风险计划。\n\n## 口径与数据\n\n- 用户级随机；分母为全部唯一入组用户。\n- 每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款，单位 CNY。\n- 数据来源声明：synthetic。\n- 订单完整性水位：2026-09-15T00:00:00+08:00。\n- 水位由上游声明并由本地负责人确认，系统不认证其真实性。\n\n## 核心证据\n\n| 指标 | 对照 | 实验 | 绝对差值 | 差值 95% 区间 |\n| --- | ---: | ---: | ---: | --- |\n| 7 天支付用户转化率 | 10.00% | 15.00% | +5.00 个百分点 | [2.9561, 7.0439] 个百分点 |\n| 7 天支付 GMV / 用户 | ¥0.1000 | ¥0.0825 | ¥-0.0175 | [-0.0332, -0.0018] 元 / 用户 |\n\n## 预设风险边界\n\n- 每用户 GMV 最多允许损失 ¥0.0200。\n- 使用双侧 95% 差值区间保守判断；跨越允许损失边界时返回证据不足。\n- 本次只处理一个主指标与一个护栏；不等同于完整实验平台风险控制。\n\n口径确认：合成回放：数据负责人；仅为本地署名记录，不是企业身份认证或上线批准。\n\n版本：1490d897c9728a1b83186f87f165a249e4eed928c9db91b0befd94d085115c5c · 评审卡：dc086121979548c2266f8a99bca47acbfcdbc3b0fc0f42acfc2bfe580e58d4d5 · bundle-review-v1\n\n本卡不执行上线。撤回或数据更新后，需要重新确认当前版本。"
      },
      "recovery": null
    },
    {
      "id": "stale_confirmation",
      "name": "旧确认自动失效",
      "description": "数据快照更新后，上一版评审卡及确认不再沿用。",
      "inspection": {
        "status": "NEEDS_CONFIRMATION",
        "snapshot_id": "6583a2134e15ac3650f4e93e3c92fa0bb4648ca63ad6ed11fec3b628cf437675",
        "inspection": {
          "snapshot_id": "6583a2134e15ac3650f4e93e3c92fa0bb4648ca63ad6ed11fec3b628cf437675",
          "valid": true,
          "contract": {
            "schema_version": 1,
            "experiment_id": "synthetic-detail-page-001",
            "objective": "提升详情页 7 天支付转化率，同时限制每用户支付 GMV 损失",
            "randomization_unit": "user",
            "expected_control_ratio": 0.5,
            "enrollment_start": "2026-09-01T00:00:00+08:00",
            "enrollment_end": "2026-09-08T00:00:00+08:00",
            "observation_days": 7,
            "timezone": "Asia/Shanghai",
            "currency": "CNY",
            "conversion_event": "paid_order",
            "denominator": "all_assigned_users",
            "zero_policy": "after_watermark_only",
            "refunds": "not_deducted",
            "alpha": 0.05,
            "analysis_mode": "fixed_horizon",
            "policy": {
              "intent": "conversion_guarded",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "manifest": {
            "snapshot_at": "2026-09-16T13:00:00+08:00",
            "assignments_complete_through": "2026-09-08T00:00:00+08:00",
            "orders_complete_through": "2026-09-15T00:00:00+08:00",
            "source_evidence": "SYNTHETIC-WATERMARK-001：仅用于验证数据规则的合成完整性声明",
            "origin": "synthetic"
          },
          "counts": {
            "required_complete_through": "2026-09-15T00:00:00+08:00",
            "raw_assignments": 4000,
            "raw_orders": 500,
            "assigned_users": 4000,
            "control_users": 2000,
            "treatment_users": 2000,
            "unique_orders": 500,
            "included_orders": 500,
            "duplicate_orders": 0,
            "duplicate_assignments": 0,
            "excluded_orders": 0,
            "late_arriving_orders": 0
          },
          "issues": []
        },
        "decision": {
          "status": "NEEDS_CONFIRMATION",
          "label": "请先确认口径与水位",
          "reason": "分母为全部唯一入组用户；按每人入组后 7 天支付计算，只有完整性声明成立时才计零。"
        },
        "owner": "数据负责人",
        "next_action": "核对口径、上游完整性证据和去重记录，署名确认当前数据包版本。",
        "report": null,
        "confirmation": null,
        "card_id": "e6cf845e72a0276ecf58245c4838652bce951dd934ecb5fb5b8a3afe3982b391",
        "history": [
          {
            "event": "imported",
            "at": "2026-10-23T08:08:06.440953+00:00",
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7"
          },
          {
            "event": "definitions_confirmed",
            "at": "2026-10-23T08:08:06.440956+00:00",
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
            "by": "合成回放：数据负责人",
            "scope": "definitions_and_declared_completeness"
          },
          {
            "event": "superseded",
            "at": "2026-10-23T08:08:06.458662+00:00",
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
            "replacement": "6583a2134e15ac3650f4e93e3c92fa0bb4648ca63ad6ed11fec3b628cf437675"
          },
          {
            "event": "imported",
            "at": "2026-10-23T08:08:06.458664+00:00",
            "snapshot_id": "6583a2134e15ac3650f4e93e3c92fa0bb4648ca63ad6ed11fec3b628cf437675"
          }
        ],
        "human_review": null,
        "engine_version": "bundle-review-v1",
        "markdown": "# 请先确认口径与水位\n\n分母为全部唯一入组用户；按每人入组后 7 天支付计算，只有完整性声明成立时才计零。\n\n**接管角色：** 数据负责人\n\n**下一步：** 核对口径、上游完整性证据和去重记录，署名确认当前数据包版本。\n\n## 口径与数据\n\n- 用户级随机；分母为全部唯一入组用户。\n- 每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款，单位 CNY。\n- 数据来源声明：synthetic。\n- 订单完整性水位：2026-09-15T00:00:00+08:00。\n- 水位由上游声明并由本地负责人确认，系统不认证其真实性。\n\n版本：6583a2134e15ac3650f4e93e3c92fa0bb4648ca63ad6ed11fec3b628cf437675 · 评审卡：e6cf845e72a0276ecf58245c4838652bce951dd934ecb5fb5b8a3afe3982b391 · bundle-review-v1\n\n本卡不执行上线。撤回或数据更新后，需要重新确认当前版本。"
      },
      "confirmed": {
        "status": "REVIEW_READY",
        "snapshot_id": "6583a2134e15ac3650f4e93e3c92fa0bb4648ca63ad6ed11fec3b628cf437675",
        "inspection": {
          "snapshot_id": "6583a2134e15ac3650f4e93e3c92fa0bb4648ca63ad6ed11fec3b628cf437675",
          "valid": true,
          "contract": {
            "schema_version": 1,
            "experiment_id": "synthetic-detail-page-001",
            "objective": "提升详情页 7 天支付转化率，同时限制每用户支付 GMV 损失",
            "randomization_unit": "user",
            "expected_control_ratio": 0.5,
            "enrollment_start": "2026-09-01T00:00:00+08:00",
            "enrollment_end": "2026-09-08T00:00:00+08:00",
            "observation_days": 7,
            "timezone": "Asia/Shanghai",
            "currency": "CNY",
            "conversion_event": "paid_order",
            "denominator": "all_assigned_users",
            "zero_policy": "after_watermark_only",
            "refunds": "not_deducted",
            "alpha": 0.05,
            "analysis_mode": "fixed_horizon",
            "policy": {
              "intent": "conversion_guarded",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "manifest": {
            "snapshot_at": "2026-09-16T13:00:00+08:00",
            "assignments_complete_through": "2026-09-08T00:00:00+08:00",
            "orders_complete_through": "2026-09-15T00:00:00+08:00",
            "source_evidence": "SYNTHETIC-WATERMARK-001：仅用于验证数据规则的合成完整性声明",
            "origin": "synthetic"
          },
          "counts": {
            "required_complete_through": "2026-09-15T00:00:00+08:00",
            "raw_assignments": 4000,
            "raw_orders": 500,
            "assigned_users": 4000,
            "control_users": 2000,
            "treatment_users": 2000,
            "unique_orders": 500,
            "included_orders": 500,
            "duplicate_orders": 0,
            "duplicate_assignments": 0,
            "excluded_orders": 0,
            "late_arriving_orders": 0
          },
          "issues": []
        },
        "decision": {
          "core_ci": [
            0.029560855038664492,
            0.07043914496133549
          ],
          "gmv_ci": [
            -0.016326154309639837,
            0.017326154309639838
          ],
          "allowed_gmv_loss": 0.02,
          "policy_id": "423074f31e9d66431a31cacc03364458ded356468d43137edc678309e325f0de",
          "method": "predeclared absolute margin with two-sided 95% difference CI; one core and one guardrail",
          "status": "REVIEW_READY",
          "label": "可进入人工发布评审",
          "reason": "主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。"
        },
        "owner": "业务负责人",
        "next_action": "核对收益、预设风险边界与实施成本后，由业务负责人记录人工复核；系统不执行上线。",
        "report": {
          "status": "DONE",
          "task_type": "release_recommendation",
          "summary": "可进入人工发布评审：主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。",
          "review_gate": {
            "status": "READY",
            "checks": {
              "quality_check": "PASS",
              "metric_analysis": "PASS",
              "result_validation": "PASS"
            },
            "blockers": [],
            "owner": "实验分析负责人",
            "next_action": "必检已完成；由业务负责人结合证据与风险，确认是否进入发布评审。"
          },
          "plan": [
            {
              "name": "确认输入",
              "purpose": "确认核心指标、护栏指标和发布标准"
            },
            {
              "name": "质量检查",
              "purpose": "若实验质量异常则降低建议强度"
            },
            {
              "name": "指标判断",
              "purpose": "综合核心指标、护栏指标和风险"
            },
            {
              "name": "发布建议",
              "purpose": "给出不发布 / 灰度 / 可发布建议"
            }
          ],
          "missing_inputs": [],
          "warnings": [],
          "report_scope": {
            "source": "csv_bundle",
            "snapshot_id": "6583a2134e15ac3650f4e93e3c92fa0bb4648ca63ad6ed11fec3b628cf437675",
            "input_counts": {
              "required_complete_through": "2026-09-15T00:00:00+08:00",
              "raw_assignments": 4000,
              "raw_orders": 500,
              "assigned_users": 4000,
              "control_users": 2000,
              "treatment_users": 2000,
              "unique_orders": 500,
              "included_orders": 500,
              "duplicate_orders": 0,
              "duplicate_assignments": 0,
              "excluded_orders": 0,
              "late_arriving_orders": 0
            },
            "definition_confirmation": {
              "snapshot_id": "6583a2134e15ac3650f4e93e3c92fa0bb4648ca63ad6ed11fec3b628cf437675",
              "by": "合成回放：数据负责人",
              "at": "2026-10-23T08:08:06.467365+00:00",
              "scope": "definitions_and_declared_completeness"
            },
            "predeclared_policy": {
              "intent": "conversion_guarded",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "registry_entries": [],
          "quality_issues": [],
          "metric_results": [
            {
              "metric_name": "paid_user_cvr",
              "metric_kind": "conversion",
              "metric_role": "core",
              "direction": "increase",
              "control_n": 2000,
              "treatment_n": 2000,
              "control_value": 0.1,
              "treatment_value": 0.15,
              "delta_abs": 0.04999999999999999,
              "delta_rel": 0.4999999999999999,
              "p_value": 1.7449962508738146e-06,
              "ci_low": 0.029560855038664492,
              "ci_high": 0.07043914496133549,
              "significant": true,
              "statistical_method": "two_proportion_z_test_pooled; wald_ci_unpooled",
              "interpretation": "实验组相对对照组显著提升。",
              "statistical_source": "computed",
              "source_summary": "",
              "notes": ""
            },
            {
              "metric_name": "paid_gmv_per_user",
              "metric_kind": "continuous",
              "metric_role": "guardrail",
              "direction": "increase",
              "control_n": 2000,
              "treatment_n": 2000,
              "control_value": 0.1,
              "treatment_value": 0.1005,
              "delta_abs": 0.0005000000000000004,
              "delta_rel": 0.0050000000000000044,
              "p_value": 0.953544503361986,
              "ci_low": -0.016326154309639837,
              "ci_high": 0.017326154309639838,
              "significant": false,
              "statistical_method": "welch_t_test; df=3809.35",
              "interpretation": "统计上未达到显著，当前更适合表述为未形成足够证据。",
              "statistical_source": "computed",
              "source_summary": "",
              "notes": ""
            }
          ],
          "segment_findings": [],
          "facts": [
            {
              "label": "paid_user_cvr 指标结果",
              "evidence": "paid_user_cvr 对照 0.1000，实验 0.1500，绝对变化 0.0500，p=0.0000",
              "strength": "事实"
            },
            {
              "label": "paid_gmv_per_user 指标结果",
              "evidence": "paid_gmv_per_user 对照 0.1000，实验 0.1005，绝对变化 0.0005，p=0.9535",
              "strength": "事实"
            }
          ],
          "inferences": [
            {
              "label": "paid_user_cvr 方向判断",
              "evidence": "实验组相对对照组显著提升。",
              "strength": "合理推断"
            }
          ],
          "hypotheses": [],
          "recommendations": [
            {
              "label": "可进入人工发布评审",
              "reason": "主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。"
            }
          ],
          "selected_skills": [
            "quality_check",
            "experiment_recap",
            "release_recommendation"
          ],
          "agent_trace": [
            {
              "tool_name": "check_quality",
              "input": {
                "request": {
                  "type": "ExperimentRequest"
                }
              },
              "output": {
                "summary": {
                  "type": "list",
                  "count": 0
                }
              },
              "status": "ok",
              "latency_ms": 0.01,
              "error": ""
            },
            {
              "tool_name": "analyze_metric",
              "input": {
                "metrics": {
                  "type": "list",
                  "count": 2
                },
                "alpha": 0.05
              },
              "output": {
                "summary": {
                  "type": "list",
                  "count": 2
                }
              },
              "status": "ok",
              "latency_ms": 0.1,
              "error": ""
            },
            {
              "tool_name": "make_recommendation",
              "input": {
                "metric_results": {
                  "type": "list",
                  "count": 2
                },
                "quality_issues": {
                  "type": "list",
                  "count": 0
                }
              },
              "output": {
                "summary": {
                  "type": "list",
                  "count": 2
                }
              },
              "status": "ok",
              "latency_ms": 0.0,
              "error": ""
            }
          ],
          "workflow_trace": [
            {
              "stage": "planner",
              "status": "ok",
              "detail": {
                "skills": [
                  "quality_check",
                  "experiment_recap",
                  "release_recommendation"
                ],
                "tools": [
                  "check_quality",
                  "analyze_metric",
                  "make_recommendation"
                ]
              }
            },
            {
              "stage": "input_validation",
              "status": "ok",
              "detail": {
                "missing_inputs": []
              }
            },
            {
              "stage": "skill:quality_check",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "skill:experiment_recap",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "result_validation",
              "status": "ok",
              "detail": {
                "check_status": "PASS",
                "warning_count": 0
              }
            },
            {
              "stage": "skill:release_recommendation",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "guardrails",
              "status": "ok",
              "detail": {
                "review_status": "READY",
                "checks": {
                  "quality_check": "PASS",
                  "metric_analysis": "PASS",
                  "result_validation": "PASS"
                }
              }
            },
            {
              "stage": "report_generation",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "risk_policy",
              "status": "REVIEW_READY",
              "detail": {
                "policy_id": "423074f31e9d66431a31cacc03364458ded356468d43137edc678309e325f0de",
                "intent": "conversion_guarded"
              }
            }
          ]
        },
        "confirmation": {
          "snapshot_id": "6583a2134e15ac3650f4e93e3c92fa0bb4648ca63ad6ed11fec3b628cf437675",
          "by": "合成回放：数据负责人",
          "at": "2026-10-23T08:08:06.467365+00:00",
          "scope": "definitions_and_declared_completeness"
        },
        "card_id": "caffe7d201e7b1db668ce3e16ddba341ecc04bf1a81c2ca3806d1e1d38dccf76",
        "history": [
          {
            "event": "imported",
            "at": "2026-10-23T08:08:06.440953+00:00",
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7"
          },
          {
            "event": "definitions_confirmed",
            "at": "2026-10-23T08:08:06.440956+00:00",
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
            "by": "合成回放：数据负责人",
            "scope": "definitions_and_declared_completeness"
          },
          {
            "event": "superseded",
            "at": "2026-10-23T08:08:06.458662+00:00",
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
            "replacement": "6583a2134e15ac3650f4e93e3c92fa0bb4648ca63ad6ed11fec3b628cf437675"
          },
          {
            "event": "imported",
            "at": "2026-10-23T08:08:06.458664+00:00",
            "snapshot_id": "6583a2134e15ac3650f4e93e3c92fa0bb4648ca63ad6ed11fec3b628cf437675"
          },
          {
            "event": "definitions_confirmed",
            "at": "2026-10-23T08:08:06.467365+00:00",
            "snapshot_id": "6583a2134e15ac3650f4e93e3c92fa0bb4648ca63ad6ed11fec3b628cf437675",
            "by": "合成回放：数据负责人",
            "scope": "definitions_and_declared_completeness"
          }
        ],
        "human_review": null,
        "engine_version": "bundle-review-v1",
        "markdown": "# 可进入人工发布评审\n\n主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。\n\n**接管角色：** 业务负责人\n\n**下一步：** 核对收益、预设风险边界与实施成本后，由业务负责人记录人工复核；系统不执行上线。\n\n## 口径与数据\n\n- 用户级随机；分母为全部唯一入组用户。\n- 每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款，单位 CNY。\n- 数据来源声明：synthetic。\n- 订单完整性水位：2026-09-15T00:00:00+08:00。\n- 水位由上游声明并由本地负责人确认，系统不认证其真实性。\n\n## 核心证据\n\n| 指标 | 对照 | 实验 | 绝对差值 | 差值 95% 区间 |\n| --- | ---: | ---: | ---: | --- |\n| 7 天支付用户转化率 | 10.00% | 15.00% | +5.00 个百分点 | [2.9561, 7.0439] 个百分点 |\n| 7 天支付 GMV / 用户 | ¥0.1000 | ¥0.1005 | ¥+0.0005 | [-0.0163, 0.0173] 元 / 用户 |\n\n## 预设风险边界\n\n- 每用户 GMV 最多允许损失 ¥0.0200。\n- 使用双侧 95% 差值区间保守判断；跨越允许损失边界时返回证据不足。\n- 本次只处理一个主指标与一个护栏；不等同于完整实验平台风险控制。\n\n口径确认：合成回放：数据负责人；仅为本地署名记录，不是企业身份认证或上线批准。\n\n版本：6583a2134e15ac3650f4e93e3c92fa0bb4648ca63ad6ed11fec3b628cf437675 · 评审卡：caffe7d201e7b1db668ce3e16ddba341ecc04bf1a81c2ca3806d1e1d38dccf76 · bundle-review-v1\n\n本卡不执行上线。撤回或数据更新后，需要重新确认当前版本。"
      },
      "recovery": null
    },
    {
      "id": "withdrawn",
      "name": "撤回本地评审卡",
      "description": "撤回清除当前确认；再次评审需要重新核对口径。",
      "inspection": {
        "status": "NEEDS_CONFIRMATION",
        "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
        "inspection": {
          "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
          "valid": true,
          "contract": {
            "schema_version": 1,
            "experiment_id": "synthetic-detail-page-001",
            "objective": "提升详情页 7 天支付转化率，同时限制每用户支付 GMV 损失",
            "randomization_unit": "user",
            "expected_control_ratio": 0.5,
            "enrollment_start": "2026-09-01T00:00:00+08:00",
            "enrollment_end": "2026-09-08T00:00:00+08:00",
            "observation_days": 7,
            "timezone": "Asia/Shanghai",
            "currency": "CNY",
            "conversion_event": "paid_order",
            "denominator": "all_assigned_users",
            "zero_policy": "after_watermark_only",
            "refunds": "not_deducted",
            "alpha": 0.05,
            "analysis_mode": "fixed_horizon",
            "policy": {
              "intent": "conversion_guarded",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "manifest": {
            "snapshot_at": "2026-09-16T12:00:00+08:00",
            "assignments_complete_through": "2026-09-08T00:00:00+08:00",
            "orders_complete_through": "2026-09-15T00:00:00+08:00",
            "source_evidence": "SYNTHETIC-WATERMARK-001：仅用于验证数据规则的合成完整性声明",
            "origin": "synthetic"
          },
          "counts": {
            "required_complete_through": "2026-09-15T00:00:00+08:00",
            "raw_assignments": 4000,
            "raw_orders": 500,
            "assigned_users": 4000,
            "control_users": 2000,
            "treatment_users": 2000,
            "unique_orders": 500,
            "included_orders": 500,
            "duplicate_orders": 0,
            "duplicate_assignments": 0,
            "excluded_orders": 0,
            "late_arriving_orders": 0
          },
          "issues": []
        },
        "decision": {
          "status": "NEEDS_CONFIRMATION",
          "label": "请先确认口径与水位",
          "reason": "分母为全部唯一入组用户；按每人入组后 7 天支付计算，只有完整性声明成立时才计零。"
        },
        "owner": "数据负责人",
        "next_action": "核对口径、上游完整性证据和去重记录，署名确认当前数据包版本。",
        "report": null,
        "confirmation": null,
        "card_id": "d5bd79d189179625f1f011b292e95dc1d4849e5d8656b0c5c625ae09942827a2",
        "history": [
          {
            "event": "imported",
            "at": "2026-10-23T08:08:06.489303+00:00",
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7"
          },
          {
            "event": "definitions_confirmed",
            "at": "2026-10-23T08:08:06.489306+00:00",
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
            "by": "合成回放：数据负责人",
            "scope": "definitions_and_declared_completeness"
          },
          {
            "event": "withdrawn",
            "at": "2026-10-23T08:08:06.498272+00:00",
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
            "by": "合成回放：复核人",
            "reason": "示例：需要重新检查口径",
            "release_executed": false
          }
        ],
        "human_review": null,
        "engine_version": "bundle-review-v1",
        "markdown": "# 请先确认口径与水位\n\n分母为全部唯一入组用户；按每人入组后 7 天支付计算，只有完整性声明成立时才计零。\n\n**接管角色：** 数据负责人\n\n**下一步：** 核对口径、上游完整性证据和去重记录，署名确认当前数据包版本。\n\n## 口径与数据\n\n- 用户级随机；分母为全部唯一入组用户。\n- 每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款，单位 CNY。\n- 数据来源声明：synthetic。\n- 订单完整性水位：2026-09-15T00:00:00+08:00。\n- 水位由上游声明并由本地负责人确认，系统不认证其真实性。\n\n版本：4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7 · 评审卡：d5bd79d189179625f1f011b292e95dc1d4849e5d8656b0c5c625ae09942827a2 · bundle-review-v1\n\n本卡不执行上线。撤回或数据更新后，需要重新确认当前版本。"
      },
      "confirmed": {
        "status": "REVIEW_READY",
        "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
        "inspection": {
          "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
          "valid": true,
          "contract": {
            "schema_version": 1,
            "experiment_id": "synthetic-detail-page-001",
            "objective": "提升详情页 7 天支付转化率，同时限制每用户支付 GMV 损失",
            "randomization_unit": "user",
            "expected_control_ratio": 0.5,
            "enrollment_start": "2026-09-01T00:00:00+08:00",
            "enrollment_end": "2026-09-08T00:00:00+08:00",
            "observation_days": 7,
            "timezone": "Asia/Shanghai",
            "currency": "CNY",
            "conversion_event": "paid_order",
            "denominator": "all_assigned_users",
            "zero_policy": "after_watermark_only",
            "refunds": "not_deducted",
            "alpha": 0.05,
            "analysis_mode": "fixed_horizon",
            "policy": {
              "intent": "conversion_guarded",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "manifest": {
            "snapshot_at": "2026-09-16T12:00:00+08:00",
            "assignments_complete_through": "2026-09-08T00:00:00+08:00",
            "orders_complete_through": "2026-09-15T00:00:00+08:00",
            "source_evidence": "SYNTHETIC-WATERMARK-001：仅用于验证数据规则的合成完整性声明",
            "origin": "synthetic"
          },
          "counts": {
            "required_complete_through": "2026-09-15T00:00:00+08:00",
            "raw_assignments": 4000,
            "raw_orders": 500,
            "assigned_users": 4000,
            "control_users": 2000,
            "treatment_users": 2000,
            "unique_orders": 500,
            "included_orders": 500,
            "duplicate_orders": 0,
            "duplicate_assignments": 0,
            "excluded_orders": 0,
            "late_arriving_orders": 0
          },
          "issues": []
        },
        "decision": {
          "core_ci": [
            0.029560855038664492,
            0.07043914496133549
          ],
          "gmv_ci": [
            -0.016326154309639837,
            0.017326154309639838
          ],
          "allowed_gmv_loss": 0.02,
          "policy_id": "423074f31e9d66431a31cacc03364458ded356468d43137edc678309e325f0de",
          "method": "predeclared absolute margin with two-sided 95% difference CI; one core and one guardrail",
          "status": "REVIEW_READY",
          "label": "可进入人工发布评审",
          "reason": "主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。"
        },
        "owner": "业务负责人",
        "next_action": "核对收益、预设风险边界与实施成本后，由业务负责人记录人工复核；系统不执行上线。",
        "report": {
          "status": "DONE",
          "task_type": "release_recommendation",
          "summary": "可进入人工发布评审：主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。",
          "review_gate": {
            "status": "READY",
            "checks": {
              "quality_check": "PASS",
              "metric_analysis": "PASS",
              "result_validation": "PASS"
            },
            "blockers": [],
            "owner": "实验分析负责人",
            "next_action": "必检已完成；由业务负责人结合证据与风险，确认是否进入发布评审。"
          },
          "plan": [
            {
              "name": "确认输入",
              "purpose": "确认核心指标、护栏指标和发布标准"
            },
            {
              "name": "质量检查",
              "purpose": "若实验质量异常则降低建议强度"
            },
            {
              "name": "指标判断",
              "purpose": "综合核心指标、护栏指标和风险"
            },
            {
              "name": "发布建议",
              "purpose": "给出不发布 / 灰度 / 可发布建议"
            }
          ],
          "missing_inputs": [],
          "warnings": [],
          "report_scope": {
            "source": "csv_bundle",
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
            "input_counts": {
              "required_complete_through": "2026-09-15T00:00:00+08:00",
              "raw_assignments": 4000,
              "raw_orders": 500,
              "assigned_users": 4000,
              "control_users": 2000,
              "treatment_users": 2000,
              "unique_orders": 500,
              "included_orders": 500,
              "duplicate_orders": 0,
              "duplicate_assignments": 0,
              "excluded_orders": 0,
              "late_arriving_orders": 0
            },
            "definition_confirmation": {
              "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
              "by": "合成回放：数据负责人",
              "at": "2026-10-23T08:08:06.515713+00:00",
              "scope": "definitions_and_declared_completeness"
            },
            "predeclared_policy": {
              "intent": "conversion_guarded",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "registry_entries": [],
          "quality_issues": [],
          "metric_results": [
            {
              "metric_name": "paid_user_cvr",
              "metric_kind": "conversion",
              "metric_role": "core",
              "direction": "increase",
              "control_n": 2000,
              "treatment_n": 2000,
              "control_value": 0.1,
              "treatment_value": 0.15,
              "delta_abs": 0.04999999999999999,
              "delta_rel": 0.4999999999999999,
              "p_value": 1.7449962508738146e-06,
              "ci_low": 0.029560855038664492,
              "ci_high": 0.07043914496133549,
              "significant": true,
              "statistical_method": "two_proportion_z_test_pooled; wald_ci_unpooled",
              "interpretation": "实验组相对对照组显著提升。",
              "statistical_source": "computed",
              "source_summary": "",
              "notes": ""
            },
            {
              "metric_name": "paid_gmv_per_user",
              "metric_kind": "continuous",
              "metric_role": "guardrail",
              "direction": "increase",
              "control_n": 2000,
              "treatment_n": 2000,
              "control_value": 0.1,
              "treatment_value": 0.1005,
              "delta_abs": 0.0005000000000000004,
              "delta_rel": 0.0050000000000000044,
              "p_value": 0.953544503361986,
              "ci_low": -0.016326154309639837,
              "ci_high": 0.017326154309639838,
              "significant": false,
              "statistical_method": "welch_t_test; df=3809.35",
              "interpretation": "统计上未达到显著，当前更适合表述为未形成足够证据。",
              "statistical_source": "computed",
              "source_summary": "",
              "notes": ""
            }
          ],
          "segment_findings": [],
          "facts": [
            {
              "label": "paid_user_cvr 指标结果",
              "evidence": "paid_user_cvr 对照 0.1000，实验 0.1500，绝对变化 0.0500，p=0.0000",
              "strength": "事实"
            },
            {
              "label": "paid_gmv_per_user 指标结果",
              "evidence": "paid_gmv_per_user 对照 0.1000，实验 0.1005，绝对变化 0.0005，p=0.9535",
              "strength": "事实"
            }
          ],
          "inferences": [
            {
              "label": "paid_user_cvr 方向判断",
              "evidence": "实验组相对对照组显著提升。",
              "strength": "合理推断"
            }
          ],
          "hypotheses": [],
          "recommendations": [
            {
              "label": "可进入人工发布评审",
              "reason": "主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。"
            }
          ],
          "selected_skills": [
            "quality_check",
            "experiment_recap",
            "release_recommendation"
          ],
          "agent_trace": [
            {
              "tool_name": "check_quality",
              "input": {
                "request": {
                  "type": "ExperimentRequest"
                }
              },
              "output": {
                "summary": {
                  "type": "list",
                  "count": 0
                }
              },
              "status": "ok",
              "latency_ms": 0.01,
              "error": ""
            },
            {
              "tool_name": "analyze_metric",
              "input": {
                "metrics": {
                  "type": "list",
                  "count": 2
                },
                "alpha": 0.05
              },
              "output": {
                "summary": {
                  "type": "list",
                  "count": 2
                }
              },
              "status": "ok",
              "latency_ms": 0.11,
              "error": ""
            },
            {
              "tool_name": "make_recommendation",
              "input": {
                "metric_results": {
                  "type": "list",
                  "count": 2
                },
                "quality_issues": {
                  "type": "list",
                  "count": 0
                }
              },
              "output": {
                "summary": {
                  "type": "list",
                  "count": 2
                }
              },
              "status": "ok",
              "latency_ms": 0.0,
              "error": ""
            }
          ],
          "workflow_trace": [
            {
              "stage": "planner",
              "status": "ok",
              "detail": {
                "skills": [
                  "quality_check",
                  "experiment_recap",
                  "release_recommendation"
                ],
                "tools": [
                  "check_quality",
                  "analyze_metric",
                  "make_recommendation"
                ]
              }
            },
            {
              "stage": "input_validation",
              "status": "ok",
              "detail": {
                "missing_inputs": []
              }
            },
            {
              "stage": "skill:quality_check",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "skill:experiment_recap",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "result_validation",
              "status": "ok",
              "detail": {
                "check_status": "PASS",
                "warning_count": 0
              }
            },
            {
              "stage": "skill:release_recommendation",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "guardrails",
              "status": "ok",
              "detail": {
                "review_status": "READY",
                "checks": {
                  "quality_check": "PASS",
                  "metric_analysis": "PASS",
                  "result_validation": "PASS"
                }
              }
            },
            {
              "stage": "report_generation",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "risk_policy",
              "status": "REVIEW_READY",
              "detail": {
                "policy_id": "423074f31e9d66431a31cacc03364458ded356468d43137edc678309e325f0de",
                "intent": "conversion_guarded"
              }
            }
          ]
        },
        "confirmation": {
          "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
          "by": "合成回放：数据负责人",
          "at": "2026-10-23T08:08:06.515713+00:00",
          "scope": "definitions_and_declared_completeness"
        },
        "card_id": "406b823086adb9b34b08bd1b483cabf85514a450c8ecfa3ca066056c1fa2a27c",
        "history": [
          {
            "event": "imported",
            "at": "2026-10-23T08:08:06.489303+00:00",
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7"
          },
          {
            "event": "definitions_confirmed",
            "at": "2026-10-23T08:08:06.489306+00:00",
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
            "by": "合成回放：数据负责人",
            "scope": "definitions_and_declared_completeness"
          },
          {
            "event": "withdrawn",
            "at": "2026-10-23T08:08:06.498272+00:00",
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
            "by": "合成回放：复核人",
            "reason": "示例：需要重新检查口径",
            "release_executed": false
          },
          {
            "event": "definitions_confirmed",
            "at": "2026-10-23T08:08:06.515713+00:00",
            "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
            "by": "合成回放：数据负责人",
            "scope": "definitions_and_declared_completeness"
          }
        ],
        "human_review": null,
        "engine_version": "bundle-review-v1",
        "markdown": "# 可进入人工发布评审\n\n主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。\n\n**接管角色：** 业务负责人\n\n**下一步：** 核对收益、预设风险边界与实施成本后，由业务负责人记录人工复核；系统不执行上线。\n\n## 口径与数据\n\n- 用户级随机；分母为全部唯一入组用户。\n- 每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款，单位 CNY。\n- 数据来源声明：synthetic。\n- 订单完整性水位：2026-09-15T00:00:00+08:00。\n- 水位由上游声明并由本地负责人确认，系统不认证其真实性。\n\n## 核心证据\n\n| 指标 | 对照 | 实验 | 绝对差值 | 差值 95% 区间 |\n| --- | ---: | ---: | ---: | --- |\n| 7 天支付用户转化率 | 10.00% | 15.00% | +5.00 个百分点 | [2.9561, 7.0439] 个百分点 |\n| 7 天支付 GMV / 用户 | ¥0.1000 | ¥0.1005 | ¥+0.0005 | [-0.0163, 0.0173] 元 / 用户 |\n\n## 预设风险边界\n\n- 每用户 GMV 最多允许损失 ¥0.0200。\n- 使用双侧 95% 差值区间保守判断；跨越允许损失边界时返回证据不足。\n- 本次只处理一个主指标与一个护栏；不等同于完整实验平台风险控制。\n\n口径确认：合成回放：数据负责人；仅为本地署名记录，不是企业身份认证或上线批准。\n\n版本：4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7 · 评审卡：406b823086adb9b34b08bd1b483cabf85514a450c8ecfa3ca066056c1fa2a27c · bundle-review-v1\n\n本卡不执行上线。撤回或数据更新后，需要重新确认当前版本。"
      },
      "recovery": null
    },
    {
      "id": "duplicates",
      "name": "重复记录正确处理",
      "description": "完全相同的记录去重并留痕；冲突重复会阻断。",
      "inspection": {
        "status": "NEEDS_CONFIRMATION",
        "snapshot_id": "fd5ba5cfe587c53ed206c4dfd48bc4a95f961e4222909729d692f4457105caa9",
        "inspection": {
          "snapshot_id": "fd5ba5cfe587c53ed206c4dfd48bc4a95f961e4222909729d692f4457105caa9",
          "valid": true,
          "contract": {
            "schema_version": 1,
            "experiment_id": "synthetic-detail-page-001",
            "objective": "提升详情页 7 天支付转化率，同时限制每用户支付 GMV 损失",
            "randomization_unit": "user",
            "expected_control_ratio": 0.5,
            "enrollment_start": "2026-09-01T00:00:00+08:00",
            "enrollment_end": "2026-09-08T00:00:00+08:00",
            "observation_days": 7,
            "timezone": "Asia/Shanghai",
            "currency": "CNY",
            "conversion_event": "paid_order",
            "denominator": "all_assigned_users",
            "zero_policy": "after_watermark_only",
            "refunds": "not_deducted",
            "alpha": 0.05,
            "analysis_mode": "fixed_horizon",
            "policy": {
              "intent": "conversion_guarded",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "manifest": {
            "snapshot_at": "2026-09-16T12:00:00+08:00",
            "assignments_complete_through": "2026-09-08T00:00:00+08:00",
            "orders_complete_through": "2026-09-15T00:00:00+08:00",
            "source_evidence": "SYNTHETIC-WATERMARK-001：仅用于验证数据规则的合成完整性声明",
            "origin": "synthetic"
          },
          "counts": {
            "required_complete_through": "2026-09-15T00:00:00+08:00",
            "raw_assignments": 4001,
            "raw_orders": 501,
            "assigned_users": 4000,
            "control_users": 2000,
            "treatment_users": 2000,
            "unique_orders": 500,
            "included_orders": 500,
            "duplicate_orders": 1,
            "duplicate_assignments": 1,
            "excluded_orders": 0,
            "late_arriving_orders": 0
          },
          "issues": [
            {
              "code": "DEDUPLICATED_ASSIGNMENTS",
              "message": "完全一致的重复入组记录已去重：1 条。",
              "next_action": "确认处理记录；无需静默删改源数据。",
              "blocking": false,
              "owner": "数据负责人"
            },
            {
              "code": "DEDUPLICATED_ORDERS",
              "message": "完全一致的重复订单已去重：1 条。",
              "next_action": "确认处理记录；无需静默删改源数据。",
              "blocking": false,
              "owner": "数据负责人"
            }
          ]
        },
        "decision": {
          "status": "NEEDS_CONFIRMATION",
          "label": "请先确认口径与水位",
          "reason": "分母为全部唯一入组用户；按每人入组后 7 天支付计算，只有完整性声明成立时才计零。"
        },
        "owner": "数据负责人",
        "next_action": "核对口径、上游完整性证据和去重记录，署名确认当前数据包版本。",
        "report": null,
        "confirmation": null,
        "card_id": "e2fa3cf2c024abe5036591a9f2866b5d58131b5272a67d3ec85ea8c4ef6b9757",
        "history": [
          {
            "event": "imported",
            "at": "2026-10-23T08:08:06.537414+00:00",
            "snapshot_id": "fd5ba5cfe587c53ed206c4dfd48bc4a95f961e4222909729d692f4457105caa9"
          }
        ],
        "human_review": null,
        "engine_version": "bundle-review-v1",
        "markdown": "# 请先确认口径与水位\n\n分母为全部唯一入组用户；按每人入组后 7 天支付计算，只有完整性声明成立时才计零。\n\n**接管角色：** 数据负责人\n\n**下一步：** 核对口径、上游完整性证据和去重记录，署名确认当前数据包版本。\n\n## 口径与数据\n\n- 用户级随机；分母为全部唯一入组用户。\n- 每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款，单位 CNY。\n- 数据来源声明：synthetic。\n- 订单完整性水位：2026-09-15T00:00:00+08:00。\n- 水位由上游声明并由本地负责人确认，系统不认证其真实性。\n\n## 数据处理与待办\n\n- 完全一致的重复入组记录已去重：1 条。 接管：数据负责人。确认处理记录；无需静默删改源数据。\n- 完全一致的重复订单已去重：1 条。 接管：数据负责人。确认处理记录；无需静默删改源数据。\n\n版本：fd5ba5cfe587c53ed206c4dfd48bc4a95f961e4222909729d692f4457105caa9 · 评审卡：e2fa3cf2c024abe5036591a9f2866b5d58131b5272a67d3ec85ea8c4ef6b9757 · bundle-review-v1\n\n本卡不执行上线。撤回或数据更新后，需要重新确认当前版本。"
      },
      "confirmed": {
        "status": "REVIEW_READY",
        "snapshot_id": "fd5ba5cfe587c53ed206c4dfd48bc4a95f961e4222909729d692f4457105caa9",
        "inspection": {
          "snapshot_id": "fd5ba5cfe587c53ed206c4dfd48bc4a95f961e4222909729d692f4457105caa9",
          "valid": true,
          "contract": {
            "schema_version": 1,
            "experiment_id": "synthetic-detail-page-001",
            "objective": "提升详情页 7 天支付转化率，同时限制每用户支付 GMV 损失",
            "randomization_unit": "user",
            "expected_control_ratio": 0.5,
            "enrollment_start": "2026-09-01T00:00:00+08:00",
            "enrollment_end": "2026-09-08T00:00:00+08:00",
            "observation_days": 7,
            "timezone": "Asia/Shanghai",
            "currency": "CNY",
            "conversion_event": "paid_order",
            "denominator": "all_assigned_users",
            "zero_policy": "after_watermark_only",
            "refunds": "not_deducted",
            "alpha": 0.05,
            "analysis_mode": "fixed_horizon",
            "policy": {
              "intent": "conversion_guarded",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "manifest": {
            "snapshot_at": "2026-09-16T12:00:00+08:00",
            "assignments_complete_through": "2026-09-08T00:00:00+08:00",
            "orders_complete_through": "2026-09-15T00:00:00+08:00",
            "source_evidence": "SYNTHETIC-WATERMARK-001：仅用于验证数据规则的合成完整性声明",
            "origin": "synthetic"
          },
          "counts": {
            "required_complete_through": "2026-09-15T00:00:00+08:00",
            "raw_assignments": 4001,
            "raw_orders": 501,
            "assigned_users": 4000,
            "control_users": 2000,
            "treatment_users": 2000,
            "unique_orders": 500,
            "included_orders": 500,
            "duplicate_orders": 1,
            "duplicate_assignments": 1,
            "excluded_orders": 0,
            "late_arriving_orders": 0
          },
          "issues": [
            {
              "code": "DEDUPLICATED_ASSIGNMENTS",
              "message": "完全一致的重复入组记录已去重：1 条。",
              "next_action": "确认处理记录；无需静默删改源数据。",
              "blocking": false,
              "owner": "数据负责人"
            },
            {
              "code": "DEDUPLICATED_ORDERS",
              "message": "完全一致的重复订单已去重：1 条。",
              "next_action": "确认处理记录；无需静默删改源数据。",
              "blocking": false,
              "owner": "数据负责人"
            }
          ]
        },
        "decision": {
          "core_ci": [
            0.029560855038664492,
            0.07043914496133549
          ],
          "gmv_ci": [
            -0.016326154309639837,
            0.017326154309639838
          ],
          "allowed_gmv_loss": 0.02,
          "policy_id": "423074f31e9d66431a31cacc03364458ded356468d43137edc678309e325f0de",
          "method": "predeclared absolute margin with two-sided 95% difference CI; one core and one guardrail",
          "status": "REVIEW_READY",
          "label": "可进入人工发布评审",
          "reason": "主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。"
        },
        "owner": "业务负责人",
        "next_action": "核对收益、预设风险边界与实施成本后，由业务负责人记录人工复核；系统不执行上线。",
        "report": {
          "status": "DONE",
          "task_type": "release_recommendation",
          "summary": "可进入人工发布评审：主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。",
          "review_gate": {
            "status": "READY",
            "checks": {
              "quality_check": "PASS",
              "metric_analysis": "PASS",
              "result_validation": "PASS"
            },
            "blockers": [],
            "owner": "实验分析负责人",
            "next_action": "必检已完成；由业务负责人结合证据与风险，确认是否进入发布评审。"
          },
          "plan": [
            {
              "name": "确认输入",
              "purpose": "确认核心指标、护栏指标和发布标准"
            },
            {
              "name": "质量检查",
              "purpose": "若实验质量异常则降低建议强度"
            },
            {
              "name": "指标判断",
              "purpose": "综合核心指标、护栏指标和风险"
            },
            {
              "name": "发布建议",
              "purpose": "给出不发布 / 灰度 / 可发布建议"
            }
          ],
          "missing_inputs": [],
          "warnings": [],
          "report_scope": {
            "source": "csv_bundle",
            "snapshot_id": "fd5ba5cfe587c53ed206c4dfd48bc4a95f961e4222909729d692f4457105caa9",
            "input_counts": {
              "required_complete_through": "2026-09-15T00:00:00+08:00",
              "raw_assignments": 4001,
              "raw_orders": 501,
              "assigned_users": 4000,
              "control_users": 2000,
              "treatment_users": 2000,
              "unique_orders": 500,
              "included_orders": 500,
              "duplicate_orders": 1,
              "duplicate_assignments": 1,
              "excluded_orders": 0,
              "late_arriving_orders": 0
            },
            "definition_confirmation": {
              "snapshot_id": "fd5ba5cfe587c53ed206c4dfd48bc4a95f961e4222909729d692f4457105caa9",
              "by": "合成回放：数据负责人",
              "at": "2026-10-23T08:08:06.546090+00:00",
              "scope": "definitions_and_declared_completeness"
            },
            "predeclared_policy": {
              "intent": "conversion_guarded",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "registry_entries": [],
          "quality_issues": [],
          "metric_results": [
            {
              "metric_name": "paid_user_cvr",
              "metric_kind": "conversion",
              "metric_role": "core",
              "direction": "increase",
              "control_n": 2000,
              "treatment_n": 2000,
              "control_value": 0.1,
              "treatment_value": 0.15,
              "delta_abs": 0.04999999999999999,
              "delta_rel": 0.4999999999999999,
              "p_value": 1.7449962508738146e-06,
              "ci_low": 0.029560855038664492,
              "ci_high": 0.07043914496133549,
              "significant": true,
              "statistical_method": "two_proportion_z_test_pooled; wald_ci_unpooled",
              "interpretation": "实验组相对对照组显著提升。",
              "statistical_source": "computed",
              "source_summary": "",
              "notes": ""
            },
            {
              "metric_name": "paid_gmv_per_user",
              "metric_kind": "continuous",
              "metric_role": "guardrail",
              "direction": "increase",
              "control_n": 2000,
              "treatment_n": 2000,
              "control_value": 0.1,
              "treatment_value": 0.1005,
              "delta_abs": 0.0005000000000000004,
              "delta_rel": 0.0050000000000000044,
              "p_value": 0.953544503361986,
              "ci_low": -0.016326154309639837,
              "ci_high": 0.017326154309639838,
              "significant": false,
              "statistical_method": "welch_t_test; df=3809.35",
              "interpretation": "统计上未达到显著，当前更适合表述为未形成足够证据。",
              "statistical_source": "computed",
              "source_summary": "",
              "notes": ""
            }
          ],
          "segment_findings": [],
          "facts": [
            {
              "label": "paid_user_cvr 指标结果",
              "evidence": "paid_user_cvr 对照 0.1000，实验 0.1500，绝对变化 0.0500，p=0.0000",
              "strength": "事实"
            },
            {
              "label": "paid_gmv_per_user 指标结果",
              "evidence": "paid_gmv_per_user 对照 0.1000，实验 0.1005，绝对变化 0.0005，p=0.9535",
              "strength": "事实"
            }
          ],
          "inferences": [
            {
              "label": "paid_user_cvr 方向判断",
              "evidence": "实验组相对对照组显著提升。",
              "strength": "合理推断"
            }
          ],
          "hypotheses": [],
          "recommendations": [
            {
              "label": "可进入人工发布评审",
              "reason": "主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。"
            }
          ],
          "selected_skills": [
            "quality_check",
            "experiment_recap",
            "release_recommendation"
          ],
          "agent_trace": [
            {
              "tool_name": "check_quality",
              "input": {
                "request": {
                  "type": "ExperimentRequest"
                }
              },
              "output": {
                "summary": {
                  "type": "list",
                  "count": 0
                }
              },
              "status": "ok",
              "latency_ms": 0.01,
              "error": ""
            },
            {
              "tool_name": "analyze_metric",
              "input": {
                "metrics": {
                  "type": "list",
                  "count": 2
                },
                "alpha": 0.05
              },
              "output": {
                "summary": {
                  "type": "list",
                  "count": 2
                }
              },
              "status": "ok",
              "latency_ms": 0.11,
              "error": ""
            },
            {
              "tool_name": "make_recommendation",
              "input": {
                "metric_results": {
                  "type": "list",
                  "count": 2
                },
                "quality_issues": {
                  "type": "list",
                  "count": 0
                }
              },
              "output": {
                "summary": {
                  "type": "list",
                  "count": 2
                }
              },
              "status": "ok",
              "latency_ms": 0.0,
              "error": ""
            }
          ],
          "workflow_trace": [
            {
              "stage": "planner",
              "status": "ok",
              "detail": {
                "skills": [
                  "quality_check",
                  "experiment_recap",
                  "release_recommendation"
                ],
                "tools": [
                  "check_quality",
                  "analyze_metric",
                  "make_recommendation"
                ]
              }
            },
            {
              "stage": "input_validation",
              "status": "ok",
              "detail": {
                "missing_inputs": []
              }
            },
            {
              "stage": "skill:quality_check",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "skill:experiment_recap",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "result_validation",
              "status": "ok",
              "detail": {
                "check_status": "PASS",
                "warning_count": 0
              }
            },
            {
              "stage": "skill:release_recommendation",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "guardrails",
              "status": "ok",
              "detail": {
                "review_status": "READY",
                "checks": {
                  "quality_check": "PASS",
                  "metric_analysis": "PASS",
                  "result_validation": "PASS"
                }
              }
            },
            {
              "stage": "report_generation",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "risk_policy",
              "status": "REVIEW_READY",
              "detail": {
                "policy_id": "423074f31e9d66431a31cacc03364458ded356468d43137edc678309e325f0de",
                "intent": "conversion_guarded"
              }
            }
          ]
        },
        "confirmation": {
          "snapshot_id": "fd5ba5cfe587c53ed206c4dfd48bc4a95f961e4222909729d692f4457105caa9",
          "by": "合成回放：数据负责人",
          "at": "2026-10-23T08:08:06.546090+00:00",
          "scope": "definitions_and_declared_completeness"
        },
        "card_id": "eeb2e34616aab7aaf69386da706d7fe8217d1a8cc8853f590e70aed986518a7a",
        "history": [
          {
            "event": "imported",
            "at": "2026-10-23T08:08:06.537414+00:00",
            "snapshot_id": "fd5ba5cfe587c53ed206c4dfd48bc4a95f961e4222909729d692f4457105caa9"
          },
          {
            "event": "definitions_confirmed",
            "at": "2026-10-23T08:08:06.546090+00:00",
            "snapshot_id": "fd5ba5cfe587c53ed206c4dfd48bc4a95f961e4222909729d692f4457105caa9",
            "by": "合成回放：数据负责人",
            "scope": "definitions_and_declared_completeness"
          }
        ],
        "human_review": null,
        "engine_version": "bundle-review-v1",
        "markdown": "# 可进入人工发布评审\n\n主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。\n\n**接管角色：** 业务负责人\n\n**下一步：** 核对收益、预设风险边界与实施成本后，由业务负责人记录人工复核；系统不执行上线。\n\n## 口径与数据\n\n- 用户级随机；分母为全部唯一入组用户。\n- 每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款，单位 CNY。\n- 数据来源声明：synthetic。\n- 订单完整性水位：2026-09-15T00:00:00+08:00。\n- 水位由上游声明并由本地负责人确认，系统不认证其真实性。\n\n## 核心证据\n\n| 指标 | 对照 | 实验 | 绝对差值 | 差值 95% 区间 |\n| --- | ---: | ---: | ---: | --- |\n| 7 天支付用户转化率 | 10.00% | 15.00% | +5.00 个百分点 | [2.9561, 7.0439] 个百分点 |\n| 7 天支付 GMV / 用户 | ¥0.1000 | ¥0.1005 | ¥+0.0005 | [-0.0163, 0.0173] 元 / 用户 |\n\n## 预设风险边界\n\n- 每用户 GMV 最多允许损失 ¥0.0200。\n- 使用双侧 95% 差值区间保守判断；跨越允许损失边界时返回证据不足。\n- 本次只处理一个主指标与一个护栏；不等同于完整实验平台风险控制。\n\n口径确认：合成回放：数据负责人；仅为本地署名记录，不是企业身份认证或上线批准。\n\n## 数据处理与待办\n\n- 完全一致的重复入组记录已去重：1 条。 接管：数据负责人。确认处理记录；无需静默删改源数据。\n- 完全一致的重复订单已去重：1 条。 接管：数据负责人。确认处理记录；无需静默删改源数据。\n\n版本：fd5ba5cfe587c53ed206c4dfd48bc4a95f961e4222909729d692f4457105caa9 · 评审卡：eeb2e34616aab7aaf69386da706d7fe8217d1a8cc8853f590e70aed986518a7a · bundle-review-v1\n\n本卡不执行上线。撤回或数据更新后，需要重新确认当前版本。"
      },
      "recovery": null
    },
    {
      "id": "late_arrival",
      "name": "迟到订单正确计入",
      "description": "窗口内订单只要已入库且水位齐全，就应纳入相应用户。",
      "inspection": {
        "status": "NEEDS_CONFIRMATION",
        "snapshot_id": "9c625a11d27e405ab24fedc6855094b1fb844400bdcc3ab02a371dca715a69ff",
        "inspection": {
          "snapshot_id": "9c625a11d27e405ab24fedc6855094b1fb844400bdcc3ab02a371dca715a69ff",
          "valid": true,
          "contract": {
            "schema_version": 1,
            "experiment_id": "synthetic-detail-page-001",
            "objective": "提升详情页 7 天支付转化率，同时限制每用户支付 GMV 损失",
            "randomization_unit": "user",
            "expected_control_ratio": 0.5,
            "enrollment_start": "2026-09-01T00:00:00+08:00",
            "enrollment_end": "2026-09-08T00:00:00+08:00",
            "observation_days": 7,
            "timezone": "Asia/Shanghai",
            "currency": "CNY",
            "conversion_event": "paid_order",
            "denominator": "all_assigned_users",
            "zero_policy": "after_watermark_only",
            "refunds": "not_deducted",
            "alpha": 0.05,
            "analysis_mode": "fixed_horizon",
            "policy": {
              "intent": "conversion_guarded",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "manifest": {
            "snapshot_at": "2026-09-16T12:00:00+08:00",
            "assignments_complete_through": "2026-09-08T00:00:00+08:00",
            "orders_complete_through": "2026-09-15T00:00:00+08:00",
            "source_evidence": "SYNTHETIC-WATERMARK-001：仅用于验证数据规则的合成完整性声明",
            "origin": "synthetic"
          },
          "counts": {
            "required_complete_through": "2026-09-15T00:00:00+08:00",
            "raw_assignments": 4000,
            "raw_orders": 501,
            "assigned_users": 4000,
            "control_users": 2000,
            "treatment_users": 2000,
            "unique_orders": 501,
            "included_orders": 501,
            "duplicate_orders": 0,
            "duplicate_assignments": 0,
            "excluded_orders": 0,
            "late_arriving_orders": 1
          },
          "issues": [
            {
              "code": "LATE_ORDERS_INCLUDED",
              "message": "迟到但已在快照前入库的窗口内订单已计入：1 条。",
              "next_action": "确认处理记录；无需静默删改源数据。",
              "blocking": false,
              "owner": "数据负责人"
            }
          ]
        },
        "decision": {
          "status": "NEEDS_CONFIRMATION",
          "label": "请先确认口径与水位",
          "reason": "分母为全部唯一入组用户；按每人入组后 7 天支付计算，只有完整性声明成立时才计零。"
        },
        "owner": "数据负责人",
        "next_action": "核对口径、上游完整性证据和去重记录，署名确认当前数据包版本。",
        "report": null,
        "confirmation": null,
        "card_id": "f9b96d014a799dd932401488bca340a62347fd0f1c5468a99945437209ed7f69",
        "history": [
          {
            "event": "imported",
            "at": "2026-10-23T08:08:06.567819+00:00",
            "snapshot_id": "9c625a11d27e405ab24fedc6855094b1fb844400bdcc3ab02a371dca715a69ff"
          }
        ],
        "human_review": null,
        "engine_version": "bundle-review-v1",
        "markdown": "# 请先确认口径与水位\n\n分母为全部唯一入组用户；按每人入组后 7 天支付计算，只有完整性声明成立时才计零。\n\n**接管角色：** 数据负责人\n\n**下一步：** 核对口径、上游完整性证据和去重记录，署名确认当前数据包版本。\n\n## 口径与数据\n\n- 用户级随机；分母为全部唯一入组用户。\n- 每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款，单位 CNY。\n- 数据来源声明：synthetic。\n- 订单完整性水位：2026-09-15T00:00:00+08:00。\n- 水位由上游声明并由本地负责人确认，系统不认证其真实性。\n\n## 数据处理与待办\n\n- 迟到但已在快照前入库的窗口内订单已计入：1 条。 接管：数据负责人。确认处理记录；无需静默删改源数据。\n\n版本：9c625a11d27e405ab24fedc6855094b1fb844400bdcc3ab02a371dca715a69ff · 评审卡：f9b96d014a799dd932401488bca340a62347fd0f1c5468a99945437209ed7f69 · bundle-review-v1\n\n本卡不执行上线。撤回或数据更新后，需要重新确认当前版本。"
      },
      "confirmed": {
        "status": "REVIEW_READY",
        "snapshot_id": "9c625a11d27e405ab24fedc6855094b1fb844400bdcc3ab02a371dca715a69ff",
        "inspection": {
          "snapshot_id": "9c625a11d27e405ab24fedc6855094b1fb844400bdcc3ab02a371dca715a69ff",
          "valid": true,
          "contract": {
            "schema_version": 1,
            "experiment_id": "synthetic-detail-page-001",
            "objective": "提升详情页 7 天支付转化率，同时限制每用户支付 GMV 损失",
            "randomization_unit": "user",
            "expected_control_ratio": 0.5,
            "enrollment_start": "2026-09-01T00:00:00+08:00",
            "enrollment_end": "2026-09-08T00:00:00+08:00",
            "observation_days": 7,
            "timezone": "Asia/Shanghai",
            "currency": "CNY",
            "conversion_event": "paid_order",
            "denominator": "all_assigned_users",
            "zero_policy": "after_watermark_only",
            "refunds": "not_deducted",
            "alpha": 0.05,
            "analysis_mode": "fixed_horizon",
            "policy": {
              "intent": "conversion_guarded",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "manifest": {
            "snapshot_at": "2026-09-16T12:00:00+08:00",
            "assignments_complete_through": "2026-09-08T00:00:00+08:00",
            "orders_complete_through": "2026-09-15T00:00:00+08:00",
            "source_evidence": "SYNTHETIC-WATERMARK-001：仅用于验证数据规则的合成完整性声明",
            "origin": "synthetic"
          },
          "counts": {
            "required_complete_through": "2026-09-15T00:00:00+08:00",
            "raw_assignments": 4000,
            "raw_orders": 501,
            "assigned_users": 4000,
            "control_users": 2000,
            "treatment_users": 2000,
            "unique_orders": 501,
            "included_orders": 501,
            "duplicate_orders": 0,
            "duplicate_assignments": 0,
            "excluded_orders": 0,
            "late_arriving_orders": 1
          },
          "issues": [
            {
              "code": "LATE_ORDERS_INCLUDED",
              "message": "迟到但已在快照前入库的窗口内订单已计入：1 条。",
              "next_action": "确认处理记录；无需静默删改源数据。",
              "blocking": false,
              "owner": "数据负责人"
            }
          ]
        },
        "decision": {
          "core_ci": [
            0.029042080791725843,
            0.06995791920827413
          ],
          "gmv_ci": [
            -0.016848985571538605,
            0.016848985571538605
          ],
          "allowed_gmv_loss": 0.02,
          "policy_id": "423074f31e9d66431a31cacc03364458ded356468d43137edc678309e325f0de",
          "method": "predeclared absolute margin with two-sided 95% difference CI; one core and one guardrail",
          "status": "REVIEW_READY",
          "label": "可进入人工发布评审",
          "reason": "主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。"
        },
        "owner": "业务负责人",
        "next_action": "核对收益、预设风险边界与实施成本后，由业务负责人记录人工复核；系统不执行上线。",
        "report": {
          "status": "DONE",
          "task_type": "release_recommendation",
          "summary": "可进入人工发布评审：主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。",
          "review_gate": {
            "status": "READY",
            "checks": {
              "quality_check": "PASS",
              "metric_analysis": "PASS",
              "result_validation": "PASS"
            },
            "blockers": [],
            "owner": "实验分析负责人",
            "next_action": "必检已完成；由业务负责人结合证据与风险，确认是否进入发布评审。"
          },
          "plan": [
            {
              "name": "确认输入",
              "purpose": "确认核心指标、护栏指标和发布标准"
            },
            {
              "name": "质量检查",
              "purpose": "若实验质量异常则降低建议强度"
            },
            {
              "name": "指标判断",
              "purpose": "综合核心指标、护栏指标和风险"
            },
            {
              "name": "发布建议",
              "purpose": "给出不发布 / 灰度 / 可发布建议"
            }
          ],
          "missing_inputs": [],
          "warnings": [],
          "report_scope": {
            "source": "csv_bundle",
            "snapshot_id": "9c625a11d27e405ab24fedc6855094b1fb844400bdcc3ab02a371dca715a69ff",
            "input_counts": {
              "required_complete_through": "2026-09-15T00:00:00+08:00",
              "raw_assignments": 4000,
              "raw_orders": 501,
              "assigned_users": 4000,
              "control_users": 2000,
              "treatment_users": 2000,
              "unique_orders": 501,
              "included_orders": 501,
              "duplicate_orders": 0,
              "duplicate_assignments": 0,
              "excluded_orders": 0,
              "late_arriving_orders": 1
            },
            "definition_confirmation": {
              "snapshot_id": "9c625a11d27e405ab24fedc6855094b1fb844400bdcc3ab02a371dca715a69ff",
              "by": "合成回放：数据负责人",
              "at": "2026-10-23T08:08:06.576640+00:00",
              "scope": "definitions_and_declared_completeness"
            },
            "predeclared_policy": {
              "intent": "conversion_guarded",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "registry_entries": [],
          "quality_issues": [],
          "metric_results": [
            {
              "metric_name": "paid_user_cvr",
              "metric_kind": "conversion",
              "metric_role": "core",
              "direction": "increase",
              "control_n": 2000,
              "treatment_n": 2000,
              "control_value": 0.1005,
              "treatment_value": 0.15,
              "delta_abs": 0.04949999999999999,
              "delta_rel": 0.4925373134328357,
              "p_value": 2.255673850760533e-06,
              "ci_low": 0.029042080791725843,
              "ci_high": 0.06995791920827413,
              "significant": true,
              "statistical_method": "two_proportion_z_test_pooled; wald_ci_unpooled",
              "interpretation": "实验组相对对照组显著提升。",
              "statistical_source": "computed",
              "source_summary": "",
              "notes": ""
            },
            {
              "metric_name": "paid_gmv_per_user",
              "metric_kind": "continuous",
              "metric_role": "guardrail",
              "direction": "increase",
              "control_n": 2000,
              "treatment_n": 2000,
              "control_value": 0.1005,
              "treatment_value": 0.1005,
              "delta_abs": 0.0,
              "delta_rel": 0.0,
              "p_value": 1.0,
              "ci_low": -0.016848985571538605,
              "ci_high": 0.016848985571538605,
              "significant": false,
              "statistical_method": "welch_t_test; df=3805.94",
              "interpretation": "统计上未达到显著，当前更适合表述为未形成足够证据。",
              "statistical_source": "computed",
              "source_summary": "",
              "notes": ""
            }
          ],
          "segment_findings": [],
          "facts": [
            {
              "label": "paid_user_cvr 指标结果",
              "evidence": "paid_user_cvr 对照 0.1005，实验 0.1500，绝对变化 0.0495，p=0.0000",
              "strength": "事实"
            },
            {
              "label": "paid_gmv_per_user 指标结果",
              "evidence": "paid_gmv_per_user 对照 0.1005，实验 0.1005，绝对变化 0.0000，p=1.0000",
              "strength": "事实"
            }
          ],
          "inferences": [
            {
              "label": "paid_user_cvr 方向判断",
              "evidence": "实验组相对对照组显著提升。",
              "strength": "合理推断"
            }
          ],
          "hypotheses": [],
          "recommendations": [
            {
              "label": "可进入人工发布评审",
              "reason": "主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。"
            }
          ],
          "selected_skills": [
            "quality_check",
            "experiment_recap",
            "release_recommendation"
          ],
          "agent_trace": [
            {
              "tool_name": "check_quality",
              "input": {
                "request": {
                  "type": "ExperimentRequest"
                }
              },
              "output": {
                "summary": {
                  "type": "list",
                  "count": 0
                }
              },
              "status": "ok",
              "latency_ms": 0.01,
              "error": ""
            },
            {
              "tool_name": "analyze_metric",
              "input": {
                "metrics": {
                  "type": "list",
                  "count": 2
                },
                "alpha": 0.05
              },
              "output": {
                "summary": {
                  "type": "list",
                  "count": 2
                }
              },
              "status": "ok",
              "latency_ms": 0.1,
              "error": ""
            },
            {
              "tool_name": "make_recommendation",
              "input": {
                "metric_results": {
                  "type": "list",
                  "count": 2
                },
                "quality_issues": {
                  "type": "list",
                  "count": 0
                }
              },
              "output": {
                "summary": {
                  "type": "list",
                  "count": 2
                }
              },
              "status": "ok",
              "latency_ms": 0.0,
              "error": ""
            }
          ],
          "workflow_trace": [
            {
              "stage": "planner",
              "status": "ok",
              "detail": {
                "skills": [
                  "quality_check",
                  "experiment_recap",
                  "release_recommendation"
                ],
                "tools": [
                  "check_quality",
                  "analyze_metric",
                  "make_recommendation"
                ]
              }
            },
            {
              "stage": "input_validation",
              "status": "ok",
              "detail": {
                "missing_inputs": []
              }
            },
            {
              "stage": "skill:quality_check",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "skill:experiment_recap",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "result_validation",
              "status": "ok",
              "detail": {
                "check_status": "PASS",
                "warning_count": 0
              }
            },
            {
              "stage": "skill:release_recommendation",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "guardrails",
              "status": "ok",
              "detail": {
                "review_status": "READY",
                "checks": {
                  "quality_check": "PASS",
                  "metric_analysis": "PASS",
                  "result_validation": "PASS"
                }
              }
            },
            {
              "stage": "report_generation",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "risk_policy",
              "status": "REVIEW_READY",
              "detail": {
                "policy_id": "423074f31e9d66431a31cacc03364458ded356468d43137edc678309e325f0de",
                "intent": "conversion_guarded"
              }
            }
          ]
        },
        "confirmation": {
          "snapshot_id": "9c625a11d27e405ab24fedc6855094b1fb844400bdcc3ab02a371dca715a69ff",
          "by": "合成回放：数据负责人",
          "at": "2026-10-23T08:08:06.576640+00:00",
          "scope": "definitions_and_declared_completeness"
        },
        "card_id": "b868097e7fa9b7149928889dbc8dc45c272db0d0d00f346365ab8fcb7da93db4",
        "history": [
          {
            "event": "imported",
            "at": "2026-10-23T08:08:06.567819+00:00",
            "snapshot_id": "9c625a11d27e405ab24fedc6855094b1fb844400bdcc3ab02a371dca715a69ff"
          },
          {
            "event": "definitions_confirmed",
            "at": "2026-10-23T08:08:06.576640+00:00",
            "snapshot_id": "9c625a11d27e405ab24fedc6855094b1fb844400bdcc3ab02a371dca715a69ff",
            "by": "合成回放：数据负责人",
            "scope": "definitions_and_declared_completeness"
          }
        ],
        "human_review": null,
        "engine_version": "bundle-review-v1",
        "markdown": "# 可进入人工发布评审\n\n主指标形成正向证据，GMV 区间处于预设损失边界内；仍需业务负责人确认。\n\n**接管角色：** 业务负责人\n\n**下一步：** 核对收益、预设风险边界与实施成本后，由业务负责人记录人工复核；系统不执行上线。\n\n## 口径与数据\n\n- 用户级随机；分母为全部唯一入组用户。\n- 每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款，单位 CNY。\n- 数据来源声明：synthetic。\n- 订单完整性水位：2026-09-15T00:00:00+08:00。\n- 水位由上游声明并由本地负责人确认，系统不认证其真实性。\n\n## 核心证据\n\n| 指标 | 对照 | 实验 | 绝对差值 | 差值 95% 区间 |\n| --- | ---: | ---: | ---: | --- |\n| 7 天支付用户转化率 | 10.05% | 15.00% | +4.95 个百分点 | [2.9042, 6.9958] 个百分点 |\n| 7 天支付 GMV / 用户 | ¥0.1005 | ¥0.1005 | ¥+0.0000 | [-0.0168, 0.0168] 元 / 用户 |\n\n## 预设风险边界\n\n- 每用户 GMV 最多允许损失 ¥0.0200。\n- 使用双侧 95% 差值区间保守判断；跨越允许损失边界时返回证据不足。\n- 本次只处理一个主指标与一个护栏；不等同于完整实验平台风险控制。\n\n口径确认：合成回放：数据负责人；仅为本地署名记录，不是企业身份认证或上线批准。\n\n## 数据处理与待办\n\n- 迟到但已在快照前入库的窗口内订单已计入：1 条。 接管：数据负责人。确认处理记录；无需静默删改源数据。\n\n版本：9c625a11d27e405ab24fedc6855094b1fb844400bdcc3ab02a371dca715a69ff · 评审卡：b868097e7fa9b7149928889dbc8dc45c272db0d0d00f346365ab8fcb7da93db4 · bundle-review-v1\n\n本卡不执行上线。撤回或数据更新后，需要重新确认当前版本。"
      },
      "recovery": null
    },
    {
      "id": "learning",
      "name": "学习意图",
      "description": "预设学习目标的实验记录结论，不自动转成发布建议。",
      "inspection": {
        "status": "NEEDS_CONFIRMATION",
        "snapshot_id": "039b2dd2beae028d81ff9951d07ca254b871238272672512fd9ee2cd7a93cfd6",
        "inspection": {
          "snapshot_id": "039b2dd2beae028d81ff9951d07ca254b871238272672512fd9ee2cd7a93cfd6",
          "valid": true,
          "contract": {
            "schema_version": 1,
            "experiment_id": "synthetic-detail-page-001",
            "objective": "提升详情页 7 天支付转化率，同时限制每用户支付 GMV 损失",
            "randomization_unit": "user",
            "expected_control_ratio": 0.5,
            "enrollment_start": "2026-09-01T00:00:00+08:00",
            "enrollment_end": "2026-09-08T00:00:00+08:00",
            "observation_days": 7,
            "timezone": "Asia/Shanghai",
            "currency": "CNY",
            "conversion_event": "paid_order",
            "denominator": "all_assigned_users",
            "zero_policy": "after_watermark_only",
            "refunds": "not_deducted",
            "alpha": 0.05,
            "analysis_mode": "fixed_horizon",
            "policy": {
              "intent": "learning",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "manifest": {
            "snapshot_at": "2026-09-16T12:00:00+08:00",
            "assignments_complete_through": "2026-09-08T00:00:00+08:00",
            "orders_complete_through": "2026-09-15T00:00:00+08:00",
            "source_evidence": "SYNTHETIC-WATERMARK-001：仅用于验证数据规则的合成完整性声明",
            "origin": "synthetic"
          },
          "counts": {
            "required_complete_through": "2026-09-15T00:00:00+08:00",
            "raw_assignments": 4000,
            "raw_orders": 500,
            "assigned_users": 4000,
            "control_users": 2000,
            "treatment_users": 2000,
            "unique_orders": 500,
            "included_orders": 500,
            "duplicate_orders": 0,
            "duplicate_assignments": 0,
            "excluded_orders": 0,
            "late_arriving_orders": 0
          },
          "issues": []
        },
        "decision": {
          "status": "NEEDS_CONFIRMATION",
          "label": "请先确认口径与水位",
          "reason": "分母为全部唯一入组用户；按每人入组后 7 天支付计算，只有完整性声明成立时才计零。"
        },
        "owner": "数据负责人",
        "next_action": "核对口径、上游完整性证据和去重记录，署名确认当前数据包版本。",
        "report": null,
        "confirmation": null,
        "card_id": "44fd8b6b5e0738970273e30bd496a86a658442231e6a9d6235980fb0e782aa25",
        "history": [
          {
            "event": "imported",
            "at": "2026-10-23T08:08:06.598474+00:00",
            "snapshot_id": "039b2dd2beae028d81ff9951d07ca254b871238272672512fd9ee2cd7a93cfd6"
          }
        ],
        "human_review": null,
        "engine_version": "bundle-review-v1",
        "markdown": "# 请先确认口径与水位\n\n分母为全部唯一入组用户；按每人入组后 7 天支付计算，只有完整性声明成立时才计零。\n\n**接管角色：** 数据负责人\n\n**下一步：** 核对口径、上游完整性证据和去重记录，署名确认当前数据包版本。\n\n## 口径与数据\n\n- 用户级随机；分母为全部唯一入组用户。\n- 每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款，单位 CNY。\n- 数据来源声明：synthetic。\n- 订单完整性水位：2026-09-15T00:00:00+08:00。\n- 水位由上游声明并由本地负责人确认，系统不认证其真实性。\n\n版本：039b2dd2beae028d81ff9951d07ca254b871238272672512fd9ee2cd7a93cfd6 · 评审卡：44fd8b6b5e0738970273e30bd496a86a658442231e6a9d6235980fb0e782aa25 · bundle-review-v1\n\n本卡不执行上线。撤回或数据更新后，需要重新确认当前版本。"
      },
      "confirmed": {
        "status": "LEARNING_ONLY",
        "snapshot_id": "039b2dd2beae028d81ff9951d07ca254b871238272672512fd9ee2cd7a93cfd6",
        "inspection": {
          "snapshot_id": "039b2dd2beae028d81ff9951d07ca254b871238272672512fd9ee2cd7a93cfd6",
          "valid": true,
          "contract": {
            "schema_version": 1,
            "experiment_id": "synthetic-detail-page-001",
            "objective": "提升详情页 7 天支付转化率，同时限制每用户支付 GMV 损失",
            "randomization_unit": "user",
            "expected_control_ratio": 0.5,
            "enrollment_start": "2026-09-01T00:00:00+08:00",
            "enrollment_end": "2026-09-08T00:00:00+08:00",
            "observation_days": 7,
            "timezone": "Asia/Shanghai",
            "currency": "CNY",
            "conversion_event": "paid_order",
            "denominator": "all_assigned_users",
            "zero_policy": "after_watermark_only",
            "refunds": "not_deducted",
            "alpha": 0.05,
            "analysis_mode": "fixed_horizon",
            "policy": {
              "intent": "learning",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "manifest": {
            "snapshot_at": "2026-09-16T12:00:00+08:00",
            "assignments_complete_through": "2026-09-08T00:00:00+08:00",
            "orders_complete_through": "2026-09-15T00:00:00+08:00",
            "source_evidence": "SYNTHETIC-WATERMARK-001：仅用于验证数据规则的合成完整性声明",
            "origin": "synthetic"
          },
          "counts": {
            "required_complete_through": "2026-09-15T00:00:00+08:00",
            "raw_assignments": 4000,
            "raw_orders": 500,
            "assigned_users": 4000,
            "control_users": 2000,
            "treatment_users": 2000,
            "unique_orders": 500,
            "included_orders": 500,
            "duplicate_orders": 0,
            "duplicate_assignments": 0,
            "excluded_orders": 0,
            "late_arriving_orders": 0
          },
          "issues": []
        },
        "decision": {
          "core_ci": [
            0.029560855038664492,
            0.07043914496133549
          ],
          "gmv_ci": [
            -0.016326154309639837,
            0.017326154309639838
          ],
          "allowed_gmv_loss": 0.02,
          "policy_id": "9c505f960d7941b1bcbc4d6f3a84dec7ae6bb23d3fc896a93dfc60561894d1d6",
          "method": "predeclared absolute margin with two-sided 95% difference CI; one core and one guardrail",
          "status": "LEARNING_ONLY",
          "label": "记录学习结果",
          "reason": "预设意图为学习验证，不据此生成发布建议；支付 GMV 变化仍需复核。"
        },
        "owner": "业务负责人",
        "next_action": "记录学习结果与下一轮验证问题；本实验不产生上线批准。",
        "report": {
          "status": "DONE_WITH_CONCERNS",
          "task_type": "release_recommendation",
          "summary": "记录学习结果：预设意图为学习验证，不据此生成发布建议；支付 GMV 变化仍需复核。",
          "review_gate": {
            "status": "READY",
            "checks": {
              "quality_check": "PASS",
              "metric_analysis": "PASS",
              "result_validation": "PASS"
            },
            "blockers": [],
            "owner": "实验分析负责人",
            "next_action": "必检已完成；由业务负责人结合证据与风险，确认是否进入发布评审。"
          },
          "plan": [
            {
              "name": "确认输入",
              "purpose": "确认核心指标、护栏指标和发布标准"
            },
            {
              "name": "质量检查",
              "purpose": "若实验质量异常则降低建议强度"
            },
            {
              "name": "指标判断",
              "purpose": "综合核心指标、护栏指标和风险"
            },
            {
              "name": "发布建议",
              "purpose": "给出不发布 / 灰度 / 可发布建议"
            }
          ],
          "missing_inputs": [],
          "warnings": [],
          "report_scope": {
            "source": "csv_bundle",
            "snapshot_id": "039b2dd2beae028d81ff9951d07ca254b871238272672512fd9ee2cd7a93cfd6",
            "input_counts": {
              "required_complete_through": "2026-09-15T00:00:00+08:00",
              "raw_assignments": 4000,
              "raw_orders": 500,
              "assigned_users": 4000,
              "control_users": 2000,
              "treatment_users": 2000,
              "unique_orders": 500,
              "included_orders": 500,
              "duplicate_orders": 0,
              "duplicate_assignments": 0,
              "excluded_orders": 0,
              "late_arriving_orders": 0
            },
            "definition_confirmation": {
              "snapshot_id": "039b2dd2beae028d81ff9951d07ca254b871238272672512fd9ee2cd7a93cfd6",
              "by": "合成回放：数据负责人",
              "at": "2026-10-23T08:08:06.607297+00:00",
              "scope": "definitions_and_declared_completeness"
            },
            "predeclared_policy": {
              "intent": "learning",
              "max_gmv_loss_per_user": "0.02",
              "declared_at": "2026-08-31T10:00:00+08:00"
            }
          },
          "registry_entries": [],
          "quality_issues": [],
          "metric_results": [
            {
              "metric_name": "paid_user_cvr",
              "metric_kind": "conversion",
              "metric_role": "core",
              "direction": "increase",
              "control_n": 2000,
              "treatment_n": 2000,
              "control_value": 0.1,
              "treatment_value": 0.15,
              "delta_abs": 0.04999999999999999,
              "delta_rel": 0.4999999999999999,
              "p_value": 1.7449962508738146e-06,
              "ci_low": 0.029560855038664492,
              "ci_high": 0.07043914496133549,
              "significant": true,
              "statistical_method": "two_proportion_z_test_pooled; wald_ci_unpooled",
              "interpretation": "实验组相对对照组显著提升。",
              "statistical_source": "computed",
              "source_summary": "",
              "notes": ""
            },
            {
              "metric_name": "paid_gmv_per_user",
              "metric_kind": "continuous",
              "metric_role": "guardrail",
              "direction": "increase",
              "control_n": 2000,
              "treatment_n": 2000,
              "control_value": 0.1,
              "treatment_value": 0.1005,
              "delta_abs": 0.0005000000000000004,
              "delta_rel": 0.0050000000000000044,
              "p_value": 0.953544503361986,
              "ci_low": -0.016326154309639837,
              "ci_high": 0.017326154309639838,
              "significant": false,
              "statistical_method": "welch_t_test; df=3809.35",
              "interpretation": "统计上未达到显著，当前更适合表述为未形成足够证据。",
              "statistical_source": "computed",
              "source_summary": "",
              "notes": ""
            }
          ],
          "segment_findings": [],
          "facts": [
            {
              "label": "paid_user_cvr 指标结果",
              "evidence": "paid_user_cvr 对照 0.1000，实验 0.1500，绝对变化 0.0500，p=0.0000",
              "strength": "事实"
            },
            {
              "label": "paid_gmv_per_user 指标结果",
              "evidence": "paid_gmv_per_user 对照 0.1000，实验 0.1005，绝对变化 0.0005，p=0.9535",
              "strength": "事实"
            }
          ],
          "inferences": [
            {
              "label": "paid_user_cvr 方向判断",
              "evidence": "实验组相对对照组显著提升。",
              "strength": "合理推断"
            }
          ],
          "hypotheses": [],
          "recommendations": [
            {
              "label": "记录学习结果",
              "reason": "预设意图为学习验证，不据此生成发布建议；支付 GMV 变化仍需复核。"
            }
          ],
          "selected_skills": [
            "quality_check",
            "experiment_recap",
            "release_recommendation"
          ],
          "agent_trace": [
            {
              "tool_name": "check_quality",
              "input": {
                "request": {
                  "type": "ExperimentRequest"
                }
              },
              "output": {
                "summary": {
                  "type": "list",
                  "count": 0
                }
              },
              "status": "ok",
              "latency_ms": 0.01,
              "error": ""
            },
            {
              "tool_name": "analyze_metric",
              "input": {
                "metrics": {
                  "type": "list",
                  "count": 2
                },
                "alpha": 0.05
              },
              "output": {
                "summary": {
                  "type": "list",
                  "count": 2
                }
              },
              "status": "ok",
              "latency_ms": 0.09,
              "error": ""
            },
            {
              "tool_name": "make_recommendation",
              "input": {
                "metric_results": {
                  "type": "list",
                  "count": 2
                },
                "quality_issues": {
                  "type": "list",
                  "count": 0
                }
              },
              "output": {
                "summary": {
                  "type": "list",
                  "count": 2
                }
              },
              "status": "ok",
              "latency_ms": 0.0,
              "error": ""
            }
          ],
          "workflow_trace": [
            {
              "stage": "planner",
              "status": "ok",
              "detail": {
                "skills": [
                  "quality_check",
                  "experiment_recap",
                  "release_recommendation"
                ],
                "tools": [
                  "check_quality",
                  "analyze_metric",
                  "make_recommendation"
                ]
              }
            },
            {
              "stage": "input_validation",
              "status": "ok",
              "detail": {
                "missing_inputs": []
              }
            },
            {
              "stage": "skill:quality_check",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "skill:experiment_recap",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "result_validation",
              "status": "ok",
              "detail": {
                "check_status": "PASS",
                "warning_count": 0
              }
            },
            {
              "stage": "skill:release_recommendation",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "guardrails",
              "status": "ok",
              "detail": {
                "review_status": "READY",
                "checks": {
                  "quality_check": "PASS",
                  "metric_analysis": "PASS",
                  "result_validation": "PASS"
                }
              }
            },
            {
              "stage": "report_generation",
              "status": "ok",
              "detail": {}
            },
            {
              "stage": "risk_policy",
              "status": "LEARNING_ONLY",
              "detail": {
                "policy_id": "9c505f960d7941b1bcbc4d6f3a84dec7ae6bb23d3fc896a93dfc60561894d1d6",
                "intent": "learning"
              }
            }
          ]
        },
        "confirmation": {
          "snapshot_id": "039b2dd2beae028d81ff9951d07ca254b871238272672512fd9ee2cd7a93cfd6",
          "by": "合成回放：数据负责人",
          "at": "2026-10-23T08:08:06.607297+00:00",
          "scope": "definitions_and_declared_completeness"
        },
        "card_id": "73bfc8328de6cff584d8834a5ff670b976b3faa8a6b3747ba293c34c64581c80",
        "history": [
          {
            "event": "imported",
            "at": "2026-10-23T08:08:06.598474+00:00",
            "snapshot_id": "039b2dd2beae028d81ff9951d07ca254b871238272672512fd9ee2cd7a93cfd6"
          },
          {
            "event": "definitions_confirmed",
            "at": "2026-10-23T08:08:06.607297+00:00",
            "snapshot_id": "039b2dd2beae028d81ff9951d07ca254b871238272672512fd9ee2cd7a93cfd6",
            "by": "合成回放：数据负责人",
            "scope": "definitions_and_declared_completeness"
          }
        ],
        "human_review": null,
        "engine_version": "bundle-review-v1",
        "markdown": "# 记录学习结果\n\n预设意图为学习验证，不据此生成发布建议；支付 GMV 变化仍需复核。\n\n**接管角色：** 业务负责人\n\n**下一步：** 记录学习结果与下一轮验证问题；本实验不产生上线批准。\n\n## 口径与数据\n\n- 用户级随机；分母为全部唯一入组用户。\n- 每人入组后连续 168 小时，左闭右开；支付 GMV 未扣退款，单位 CNY。\n- 数据来源声明：synthetic。\n- 订单完整性水位：2026-09-15T00:00:00+08:00。\n- 水位由上游声明并由本地负责人确认，系统不认证其真实性。\n\n## 核心证据\n\n| 指标 | 对照 | 实验 | 绝对差值 | 差值 95% 区间 |\n| --- | ---: | ---: | ---: | --- |\n| 7 天支付用户转化率 | 10.00% | 15.00% | +5.00 个百分点 | [2.9561, 7.0439] 个百分点 |\n| 7 天支付 GMV / 用户 | ¥0.1000 | ¥0.1005 | ¥+0.0005 | [-0.0163, 0.0173] 元 / 用户 |\n\n## 预设风险边界\n\n- 每用户 GMV 最多允许损失 ¥0.0200。\n- 使用双侧 95% 差值区间保守判断；跨越允许损失边界时返回证据不足。\n- 本次只处理一个主指标与一个护栏；不等同于完整实验平台风险控制。\n\n口径确认：合成回放：数据负责人；仅为本地署名记录，不是企业身份认证或上线批准。\n\n版本：039b2dd2beae028d81ff9951d07ca254b871238272672512fd9ee2cd7a93cfd6 · 评审卡：73bfc8328de6cff584d8834a5ff670b976b3faa8a6b3747ba293c34c64581c80 · bundle-review-v1\n\n本卡不执行上线。撤回或数据更新后，需要重新确认当前版本。"
      },
      "recovery": null
    }
  ],
  "evaluation": {
    "evaluation_mode": "offline_rule_based",
    "dataset_split": "regression_only_no_holdout",
    "total_cases": 60,
    "passed_cases": 60,
    "overall_score": 1.0,
    "dimension_scores": {
      "metric_definition": 1.0,
      "numeric_accuracy": 1.0,
      "completeness": 1.0,
      "logic": 1.0,
      "expression": 1.0,
      "release_safety": 1.0,
      "bundle_behavior": 1.0,
      "bundle_release_safety": 1.0
    },
    "dimension_case_counts": {
      "metric_definition": 4,
      "numeric_accuracy": 4,
      "completeness": 4,
      "logic": 4,
      "expression": 4,
      "release_safety": 12,
      "bundle_behavior": 48,
      "bundle_release_safety": 48
    },
    "cases": [
      {
        "case_id": "C001",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "正常数据先等待人工确认",
        "category": "confirmation",
        "severity": "normal_control",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "NEEDS_CONFIRMATION",
        "observed": {
          "status": "NEEDS_CONFIRMATION",
          "issue_codes": [],
          "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
          "owner": "数据负责人",
          "next_action": "核对口径、上游完整性证据和去重记录，署名确认当前数据包版本。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C002",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "正常完成，不需要模型也能准备评审卡",
        "category": "normal",
        "severity": "normal_control",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "REVIEW_READY",
        "observed": {
          "status": "REVIEW_READY",
          "issue_codes": [],
          "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
          "owner": "业务负责人",
          "next_action": "核对收益、预设风险边界与实施成本后，由业务负责人记录人工复核；系统不执行上线。",
          "statistics_ran": true,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C003",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "完全相同重复去重且留痕",
        "category": "normal",
        "severity": "normal_control",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "REVIEW_READY",
        "observed": {
          "status": "REVIEW_READY",
          "issue_codes": [
            "DEDUPLICATED_ASSIGNMENTS",
            "DEDUPLICATED_ORDERS"
          ],
          "snapshot_id": "fd5ba5cfe587c53ed206c4dfd48bc4a95f961e4222909729d692f4457105caa9",
          "owner": "业务负责人",
          "next_action": "核对收益、预设风险边界与实施成本后，由业务负责人记录人工复核；系统不执行上线。",
          "statistics_ran": true,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C004",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "跨组用户不能静默分配",
        "category": "data_quality",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "CROSS_GROUP_USER"
          ],
          "snapshot_id": "05fb577dababc0b234f241ff6272d07caa7f0b172b0c8e842fccde1bdb8e70a6",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C005",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "冲突重复订单不能猜保留版本",
        "category": "data_quality",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "ORDER_CONFLICT"
          ],
          "snapshot_id": "0bb1acfcb85348966f6c9cfbc829d950ea743625082c4a59158dd9b42a37cc70",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C006",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "分母缺失必须补充",
        "category": "definition",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "MISSING_DEFINITION"
          ],
          "snapshot_id": "9ef1921c10827503c279a9b2bde1c40a76779ff13c65d2d94b690155b9fcd1cd",
          "owner": "数据负责人",
          "next_action": "请数据负责人补齐上述定义；系统不会猜测分母、事件或单位。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C007",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "没有水位不能把无记录当零",
        "category": "data_quality",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "MISSING_WATERMARK"
          ],
          "snapshot_id": "a24027a3cb8b629a4710186155db3077a4418f4d625ce0f4855514ce354c2429",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C008",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "窗口未成熟应等待完整数据重导",
        "category": "data_quality",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "DATA_NOT_MATURE"
          ],
          "snapshot_id": "c0d9038619459dfba2b962e10f410f99c812ceeafd1458077a02a3638e4bfc98",
          "owner": "数据负责人",
          "next_action": "等待上游完整性水位覆盖 2026-09-15T00:00:00+08:00，重新导出完整数据包。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C009",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "关联不到用户的订单阻断",
        "category": "data_quality",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "ORPHAN_ORDER"
          ],
          "snapshot_id": "b07915dbf06f1c6c4f1f606d580a3f79b93c5e24ec279acb6c8b67b4e9ca86cc",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C010",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "迟到且已入库的订单正确计入",
        "category": "normal",
        "severity": "normal_control",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "REVIEW_READY",
        "observed": {
          "status": "REVIEW_READY",
          "issue_codes": [
            "LATE_ORDERS_INCLUDED"
          ],
          "snapshot_id": "9c625a11d27e405ab24fedc6855094b1fb844400bdcc3ab02a371dca715a69ff",
          "owner": "业务负责人",
          "next_action": "核对收益、预设风险边界与实施成本后，由业务负责人记录人工复核；系统不执行上线。",
          "statistics_ran": true,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C011",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "恰好在观察终点的订单排除",
        "category": "boundary",
        "severity": "normal_control",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "REVIEW_READY",
        "observed": {
          "status": "REVIEW_READY",
          "issue_codes": [
            "OUTSIDE_OBSERVATION_WINDOW"
          ],
          "snapshot_id": "86d2de92bcd5ce415bc369fc29fd310df1acb739ceb679e199308b214471078a",
          "owner": "业务负责人",
          "next_action": "核对收益、预设风险边界与实施成本后，由业务负责人记录人工复核；系统不执行上线。",
          "statistics_ran": true,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C012",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "快照后入库记录不能混入",
        "category": "data_quality",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "SNAPSHOT_MISMATCH"
          ],
          "snapshot_id": "72e30f8e5eba2cdc571a56a9261b78b3254ffadfcddcc8b4b893b45952d49b4e",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C013",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "人工确认不能豁免 SRM",
        "category": "quality_gate",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [],
          "snapshot_id": "71b093d967a087a83c36d6519578d58c19753fc19d697d45bbedeac07b48e56d",
          "owner": "实验分析负责人",
          "next_action": "由实验分析负责人修复失败项或补齐缺失证据，重跑必检后重新生成评审卡。",
          "statistics_ran": true,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C014",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "主指标向好但护栏越界",
        "category": "risk_policy",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "DO_NOT_SHIP",
        "observed": {
          "status": "DO_NOT_SHIP",
          "issue_codes": [],
          "snapshot_id": "1db2bb7885009bb275aa5ffa558cafbc9e41204e67ff95b76b31d34816565093",
          "owner": "业务负责人",
          "next_action": "停止推进当前方案，修订设计后建立新实验，不通过修改阈值覆盖当前结果。",
          "statistics_ran": true,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C015",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "护栏不显著也可能证据不足",
        "category": "risk_policy",
        "severity": "normal_control",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "INCONCLUSIVE",
        "observed": {
          "status": "INCONCLUSIVE",
          "issue_codes": [],
          "snapshot_id": "1490d897c9728a1b83186f87f165a249e4eed928c9db91b0befd94d085115c5c",
          "owner": "业务负责人",
          "next_action": "记录证据不足，按预设计划结束本次判断；如需新实验，重新制定样本与风险计划。",
          "statistics_ran": true,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C016",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "学习意图不转成发布批准",
        "category": "risk_policy",
        "severity": "normal_control",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "LEARNING_ONLY",
        "observed": {
          "status": "LEARNING_ONLY",
          "issue_codes": [],
          "snapshot_id": "039b2dd2beae028d81ff9951d07ca254b871238272672512fd9ee2cd7a93cfd6",
          "owner": "业务负责人",
          "next_action": "记录学习结果与下一轮验证问题；本实验不产生上线批准。",
          "statistics_ran": true,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C017",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "事后阈值不可覆盖当前实验",
        "category": "risk_policy",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "POSTHOC_POLICY"
          ],
          "snapshot_id": "fcd27c76ed5e52f1a0bfdedf96f20ef8bbc7c90b29aa3d0149ea0f2c59391607",
          "owner": "业务负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C018",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "数据快照变化使旧确认失效",
        "category": "versioning",
        "severity": "normal_control",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "NEEDS_CONFIRMATION",
        "observed": {
          "status": "NEEDS_CONFIRMATION",
          "issue_codes": [],
          "snapshot_id": "6583a2134e15ac3650f4e93e3c92fa0bb4648ca63ad6ed11fec3b628cf437675",
          "owner": "数据负责人",
          "next_action": "核对口径、上游完整性证据和去重记录，署名确认当前数据包版本。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C019",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "撤回后必须重新确认",
        "category": "versioning",
        "severity": "normal_control",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "NEEDS_CONFIRMATION",
        "observed": {
          "status": "NEEDS_CONFIRMATION",
          "issue_codes": [],
          "snapshot_id": "4cf9db0851fa2e0b72678f42565a8dec14fff5c9954dcac89493a6a105a63cb7",
          "owner": "数据负责人",
          "next_action": "核对口径、上游完整性证据和去重记录，署名确认当前数据包版本。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C020",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "会话随机不能冒充用户随机",
        "category": "definition",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "UNSUPPORTED_DEFINITION"
          ],
          "snapshot_id": "a132dab589f9f1bd38a105409ad8489ac4ddbea13a0171694b3ac267cd45a825",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C021",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "混合币种不自动换算",
        "category": "data_quality",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "CURRENCY_MISMATCH"
          ],
          "snapshot_id": "5e43c9f3b082663e083521a71bdb7acc3934513b17c7deb2604b97bd1fa7cd9c",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C022",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "NaN 金额不能进入统计",
        "category": "data_quality",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "INVALID_AMOUNT"
          ],
          "snapshot_id": "5ee8a2f7f6e9f080f84fa581a194910084c54268d0ac45365c6c30a095a0345f",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C023",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "文件缺失不当成空数据",
        "category": "data_quality",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "MISSING_FILE"
          ],
          "snapshot_id": "db1a3f4aa9279fab5825f179aeea4592e950e433009c3348c29c011f16b471e8",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C024",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "金额列缺失不能替换为其他列",
        "category": "definition",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "MISSING_COLUMN"
          ],
          "snapshot_id": "12c9b345e2c261e8985b05d4ba0469b78184a5d4adb82db6aaf083beb8fadd38",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C025",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "重复表头不能歧义映射",
        "category": "schema",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "DUPLICATE_HEADER"
          ],
          "snapshot_id": "b7f0c1225a39a6683f9dbd979648a42253df65942eb850b2c1a3823db3bb3bea",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C026",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "非法编码返回可恢复错误",
        "category": "schema",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "INVALID_CSV"
          ],
          "snapshot_id": "70ee91f4206e93f6e76087df2a8c2e910f2c038930f3be9a196737351f256e71",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C027",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "坏 JSON 返回可恢复错误",
        "category": "schema",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "INVALID_JSON"
          ],
          "snapshot_id": "28b598a1a4c0fa385cae6044d86a3b5f6ed23ac1771f9dad1c6f568da51cbe40",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C028",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "同组但入组时间冲突也需修复",
        "category": "data_quality",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "ASSIGNMENT_CONFLICT"
          ],
          "snapshot_id": "a356bd775b9a2b4d2c3dc7fdd632429c0941f236de16ea29823ed5b38a5921a1",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C029",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "空入组不能计算",
        "category": "data_quality",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "INSUFFICIENT_USERS"
          ],
          "snapshot_id": "8028efcf0f8187cbb763c5e53738f3e8fd76b67804560b5aeb2016b57a8deb4d",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C030",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "无时区时间不能猜测",
        "category": "definition",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "INVALID_TIME"
          ],
          "snapshot_id": "0eee07edc09eadb4eccb048ffe5afe1cba5ab2589ebfd4b5e7d9ab22aaeb6543",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C031",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "无效 IANA 时区必须修复",
        "category": "definition",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "INVALID_TIMEZONE"
          ],
          "snapshot_id": "5a5b99250d1f1a92a113982ae66ef95f6db7f48bf2aafc6c0676f19c4c962f12",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C032",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "完整水位下零事件仍不适用当前检验",
        "category": "statistical_applicability",
        "severity": "normal_control",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [],
          "snapshot_id": "f522641236aae479e56891b8f350105cb4a99bb343b2547e499c57ec998847b2",
          "owner": "实验分析负责人",
          "next_action": "由实验分析负责人修复失败项或补齐缺失证据，重跑必检后重新生成评审卡。",
          "statistics_ran": true,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C033",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "预设策略缺失交给业务负责人",
        "category": "risk_policy",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "MISSING_POLICY"
          ],
          "snapshot_id": "9fd62f3183ba3aaee7317d27dfb6a661ea591c27f4d15d1b650c4016e67778c0",
          "owner": "业务负责人",
          "next_action": "请业务负责人确认预设策略后重新导入；不能根据结果临时放宽阈值。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C034",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "非法分流比例不能跳过 SRM",
        "category": "definition",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "INVALID_ALLOCATION"
          ],
          "snapshot_id": "69b4451977553f7b0677a61cfaa4f06328f76930e274d8bbaf5a0bfe63e6bd19",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C035",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "不能混入其他实验",
        "category": "data_quality",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "WRONG_EXPERIMENT"
          ],
          "snapshot_id": "cdcddba1d64beea5e2681d0c63204880f26d72ff8e8b817054cc1b33962d7428",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C036",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "未知组别不自动映射",
        "category": "definition",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "INVALID_VARIANT"
          ],
          "snapshot_id": "221a0c6d3fc15c981508af4991a17a906f18d0164c2f2a062f04e13167afe159",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C037",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "负金额退款属于不支持口径",
        "category": "definition",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "INVALID_AMOUNT"
          ],
          "snapshot_id": "3b767917207d53c8e44c0b562a041b53bccd88da31ad9f0e67ffb62cedd3ddb9",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C038",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "倒置入组区间必须阻断",
        "category": "boundary",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "INVALID_PERIOD"
          ],
          "snapshot_id": "7588309b3b48c0a146400d173ec759a1cf7e1ecea9d16b7e8a13b2882c11f03f",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C039",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "缺失金额不填零",
        "category": "data_quality",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "INVALID_ROW"
          ],
          "snapshot_id": "246c2b9f7a2969b947eb6cb27d1c65a4300f3f099052a8e21ddaaa55f6e37933",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C040",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "允许损失必须为非负有限数",
        "category": "risk_policy",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "INVALID_NUMBER"
          ],
          "snapshot_id": "802faf56a4ae1a7167d14fb6f2988e1f89e7316e9f28c04085d0cf5a2568cc4e",
          "owner": "业务负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C041",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "未知契约版本不默认兼容",
        "category": "schema",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "UNSUPPORTED_DEFINITION"
          ],
          "snapshot_id": "ea0bf9dd02e2da180b5d247b92770614d14ac33513fdb00e3f16e8500f1e4d73",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C042",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "入组之前支付按规则排除",
        "category": "boundary",
        "severity": "normal_control",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "REVIEW_READY",
        "observed": {
          "status": "REVIEW_READY",
          "issue_codes": [
            "OUTSIDE_OBSERVATION_WINDOW"
          ],
          "snapshot_id": "37020690f57a1dd378e35ef151555780a0c0925e52f8fc4ee233496cbc2fc141",
          "owner": "业务负责人",
          "next_action": "核对收益、预设风险边界与实施成本后，由业务负责人记录人工复核；系统不执行上线。",
          "statistics_ran": true,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C043",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "恰好入组时支付按规则计入",
        "category": "boundary",
        "severity": "normal_control",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "REVIEW_READY",
        "observed": {
          "status": "REVIEW_READY",
          "issue_codes": [
            "LATE_ORDERS_INCLUDED"
          ],
          "snapshot_id": "196cd8ef9c777ddd18ee07a0d779adae4c2cf8754f77e719a72dc1c884303d11",
          "owner": "业务负责人",
          "next_action": "核对收益、预设风险边界与实施成本后，由业务负责人记录人工复核；系统不执行上线。",
          "statistics_ran": true,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C044",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "布尔值不能冒充观察天数",
        "category": "schema",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "UNSUPPORTED_DEFINITION"
          ],
          "snapshot_id": "50f58f699907b1838ad6af30b0ca3d78f3412f45b80876b5c9cac4f2c63c82b0",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C045",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "未支持的显著性水平不能静默忽略",
        "category": "definition",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "UNSUPPORTED_DEFINITION"
          ],
          "snapshot_id": "cd305a1f7c7986ac0db892926c88d64e0e988e8f2753d5243550242ae37ae488",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C046",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "序贯意图不能使用固定周期结果",
        "category": "definition",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "UNSUPPORTED_DEFINITION"
          ],
          "snapshot_id": "4ca65fec23b305c24c2d46a31108d90c5f9103d3b461508ff87805bf22be96c6",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C047",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "错误策略字段类型应结构化报错",
        "category": "schema",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "UNSUPPORTED_POLICY"
          ],
          "snapshot_id": "6f1d6b3fa9d4c55e4a74cd5649509652aa57075ec93bc5b4a08f1219eb440018",
          "owner": "业务负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "C048",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "bundle_behavior",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "bundle_release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "美元契约不套用人民币定义",
        "category": "definition",
        "severity": "critical",
        "origin": "synthetic_bundle_replay",
        "user_task": "增长 PM 从原始 CSV 准备商品详情页上线评审卡，确认缺失证据、接管角色和恢复条件",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "issue_codes": [
            "UNSUPPORTED_DEFINITION"
          ],
          "snapshot_id": "8c6585b0a8546a124ebc04660b8efaecae27f60266e4ebe0af6d8ad6c0e1481f",
          "owner": "数据负责人",
          "next_action": "修复数据包后重新导入并确认口径。",
          "statistics_ran": false,
          "unsafe_review_advice": false
        }
      },
      {
        "case_id": "E001",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "metric_definition",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "numeric_accuracy",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "completeness",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "logic",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "expression",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "汇总输入：主指标提升但护栏受损",
        "category": "risk_policy",
        "severity": "critical",
        "origin": "synthetic_summary_fixture",
        "user_task": "增长 PM 复核汇总结果并准备人工评审材料；保留为旧入口回归",
        "expected_status": "READY",
        "observed": {
          "status": "READY",
          "owner": "实验分析负责人",
          "next_action": "必检已完成；由业务负责人结合证据与风险，确认是否进入发布评审。"
        }
      },
      {
        "case_id": "E002",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "metric_definition",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "numeric_accuracy",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "completeness",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "logic",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "expression",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "汇总输入：SRM 阻断效果解读",
        "category": "quality_gate",
        "severity": "critical",
        "origin": "synthetic_summary_fixture",
        "user_task": "增长 PM 复核汇总结果并准备人工评审材料；保留为旧入口回归",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "owner": "实验分析负责人",
          "next_action": "由实验分析负责人修复失败项或补齐缺失证据，重跑必检后重新生成评审卡。"
        }
      },
      {
        "case_id": "E003",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "metric_definition",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "numeric_accuracy",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "completeness",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "logic",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "expression",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "汇总输入：分群诊断保留探索性边界",
        "category": "normal",
        "severity": "normal_control",
        "origin": "synthetic_summary_fixture",
        "user_task": "增长 PM 复核汇总结果并准备人工评审材料；保留为旧入口回归",
        "expected_status": "READY",
        "observed": {
          "status": "READY",
          "owner": "实验分析负责人",
          "next_action": "必检已完成；由业务负责人结合证据与风险，确认是否进入发布评审。"
        }
      },
      {
        "case_id": "E004",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "metric_definition",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "numeric_accuracy",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "completeness",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "logic",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "expression",
            "passed": true,
            "score": 1.0,
            "reasons": []
          },
          {
            "name": "release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "详情页汇总：护栏受损且包含分群",
        "category": "risk_policy",
        "severity": "critical",
        "origin": "synthetic_summary_fixture",
        "user_task": "增长 PM 复核汇总结果并准备人工评审材料；保留为旧入口回归",
        "expected_status": "READY",
        "observed": {
          "status": "READY",
          "owner": "实验分析负责人",
          "next_action": "必检已完成；由业务负责人结合证据与风险，确认是否进入发布评审。"
        }
      },
      {
        "case_id": "E005",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "质量检查调用失败",
        "category": "tool_failure",
        "severity": "critical",
        "origin": "synthetic_fault_injection",
        "user_task": "增长 PM 准备商品详情页改版的人工上线评审卡",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "owner": "实验分析负责人",
          "next_action": "由实验分析负责人修复失败项或补齐缺失证据，重跑必检后重新生成评审卡。"
        }
      },
      {
        "case_id": "E006",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "统计计算调用失败",
        "category": "tool_failure",
        "severity": "critical",
        "origin": "synthetic_fault_injection",
        "user_task": "增长 PM 准备商品详情页改版的人工上线评审卡",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "owner": "实验分析负责人",
          "next_action": "由实验分析负责人修复失败项或补齐缺失证据，重跑必检后重新生成评审卡。"
        }
      },
      {
        "case_id": "E007",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "结果校验调用失败",
        "category": "tool_failure",
        "severity": "critical",
        "origin": "synthetic_fault_injection",
        "user_task": "增长 PM 准备商品详情页改版的人工上线评审卡",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "owner": "实验分析负责人",
          "next_action": "由实验分析负责人修复失败项或补齐缺失证据，重跑必检后重新生成评审卡。"
        }
      },
      {
        "case_id": "E008",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "可选分群失败保留总体建议",
        "category": "normal",
        "severity": "normal_control",
        "origin": "synthetic_fault_injection",
        "user_task": "增长 PM 准备商品详情页改版的人工上线评审卡",
        "expected_status": "READY",
        "observed": {
          "status": "READY",
          "owner": "实验分析负责人",
          "next_action": "必检已完成；由业务负责人结合证据与风险，确认是否进入发布评审。"
        }
      },
      {
        "case_id": "E009",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "建议生成调用失败",
        "category": "tool_failure",
        "severity": "critical",
        "origin": "synthetic_fault_injection",
        "user_task": "增长 PM 准备商品详情页改版的人工上线评审卡",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "owner": "实验分析负责人",
          "next_action": "由实验分析负责人恢复建议生成流程，重跑必检并重新生成评审卡。"
        }
      },
      {
        "case_id": "E010",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "正常证据允许进入人工评审",
        "category": "normal",
        "severity": "normal_control",
        "origin": "synthetic_fault_injection",
        "user_task": "增长 PM 准备商品详情页改版的人工上线评审卡",
        "expected_status": "READY",
        "observed": {
          "status": "READY",
          "owner": "实验分析负责人",
          "next_action": "必检已完成；由业务负责人结合证据与风险，确认是否进入发布评审。"
        }
      },
      {
        "case_id": "E011",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "护栏结果被静默遗漏",
        "category": "tool_failure",
        "severity": "critical",
        "origin": "synthetic_fault_injection",
        "user_task": "增长 PM 准备商品详情页改版的人工上线评审卡",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "owner": "实验分析负责人",
          "next_action": "由实验分析负责人修复失败项或补齐缺失证据，重跑必检后重新生成评审卡。"
        }
      },
      {
        "case_id": "E012",
        "passed": true,
        "score": 1.0,
        "results": [
          {
            "name": "release_safety",
            "passed": true,
            "score": 1.0,
            "reasons": []
          }
        ],
        "title": "平台统计返回非法p值",
        "category": "tool_failure",
        "severity": "critical",
        "origin": "synthetic_fault_injection",
        "user_task": "增长 PM 准备商品详情页改版的人工上线评审卡",
        "expected_status": "BLOCKED",
        "observed": {
          "status": "BLOCKED",
          "owner": "实验分析负责人",
          "next_action": "由实验分析负责人修复失败项或补齐缺失证据，重跑必检后重新生成评审卡。"
        }
      }
    ]
  },
  "categories": {
    "confirmation": {
      "total": 1,
      "passed": 1
    },
    "normal": {
      "total": 6,
      "passed": 6
    },
    "data_quality": {
      "total": 13,
      "passed": 13
    },
    "definition": {
      "total": 11,
      "passed": 11
    },
    "boundary": {
      "total": 4,
      "passed": 4
    },
    "quality_gate": {
      "total": 2,
      "passed": 2
    },
    "risk_policy": {
      "total": 8,
      "passed": 8
    },
    "versioning": {
      "total": 2,
      "passed": 2
    },
    "schema": {
      "total": 6,
      "passed": 6
    },
    "statistical_applicability": {
      "total": 1,
      "passed": 1
    },
    "tool_failure": {
      "total": 6,
      "passed": 6
    }
  },
  "limits": [
    "合成数据与本地回放",
    "全部为回归案例，尚无独立冻结验收集",
    "不调用真实模型，不证明 Agent 相对基线的收益",
    "确认是本地署名，不认证企业身份，也不执行上线"
  ]
};
