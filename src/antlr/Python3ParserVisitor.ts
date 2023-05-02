// Generated from src/antlr/Python3Parser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

import { Single_inputContext } from "./Python3Parser";
import { File_inputContext } from "./Python3Parser";
import { Eval_inputContext } from "./Python3Parser";
import { DecoratorContext } from "./Python3Parser";
import { DecoratorsContext } from "./Python3Parser";
import { DecoratedContext } from "./Python3Parser";
import { Async_funcdefContext } from "./Python3Parser";
import { FuncdefContext } from "./Python3Parser";
import { ParametersContext } from "./Python3Parser";
import { TypedargslistContext } from "./Python3Parser";
import { TfpdefContext } from "./Python3Parser";
import { VarargslistContext } from "./Python3Parser";
import { VfpdefContext } from "./Python3Parser";
import { StmtContext } from "./Python3Parser";
import { Simple_stmtsContext } from "./Python3Parser";
import { Simple_stmtContext } from "./Python3Parser";
import { Expr_stmtContext } from "./Python3Parser";
import { AnnassignContext } from "./Python3Parser";
import { Testlist_star_exprContext } from "./Python3Parser";
import { AugassignContext } from "./Python3Parser";
import { Del_stmtContext } from "./Python3Parser";
import { Pass_stmtContext } from "./Python3Parser";
import { Flow_stmtContext } from "./Python3Parser";
import { Break_stmtContext } from "./Python3Parser";
import { Continue_stmtContext } from "./Python3Parser";
import { Return_stmtContext } from "./Python3Parser";
import { Yield_stmtContext } from "./Python3Parser";
import { Raise_stmtContext } from "./Python3Parser";
import { Import_stmtContext } from "./Python3Parser";
import { Import_nameContext } from "./Python3Parser";
import { Import_fromContext } from "./Python3Parser";
import { Import_as_nameContext } from "./Python3Parser";
import { Dotted_as_nameContext } from "./Python3Parser";
import { Import_as_namesContext } from "./Python3Parser";
import { Dotted_as_namesContext } from "./Python3Parser";
import { Dotted_nameContext } from "./Python3Parser";
import { Global_stmtContext } from "./Python3Parser";
import { Nonlocal_stmtContext } from "./Python3Parser";
import { Assert_stmtContext } from "./Python3Parser";
import { Compound_stmtContext } from "./Python3Parser";
import { Async_stmtContext } from "./Python3Parser";
import { If_stmtContext } from "./Python3Parser";
import { While_stmtContext } from "./Python3Parser";
import { For_stmtContext } from "./Python3Parser";
import { Try_stmtContext } from "./Python3Parser";
import { With_stmtContext } from "./Python3Parser";
import { With_itemContext } from "./Python3Parser";
import { Except_clauseContext } from "./Python3Parser";
import { BlockContext } from "./Python3Parser";
import { Match_stmtContext } from "./Python3Parser";
import { Subject_exprContext } from "./Python3Parser";
import { Star_named_expressionsContext } from "./Python3Parser";
import { Star_named_expressionContext } from "./Python3Parser";
import { Case_blockContext } from "./Python3Parser";
import { GuardContext } from "./Python3Parser";
import { PatternsContext } from "./Python3Parser";
import { PatternContext } from "./Python3Parser";
import { As_patternContext } from "./Python3Parser";
import { Or_patternContext } from "./Python3Parser";
import { Closed_patternContext } from "./Python3Parser";
import { Literal_patternContext } from "./Python3Parser";
import { Literal_exprContext } from "./Python3Parser";
import { Complex_numberContext } from "./Python3Parser";
import { Signed_numberContext } from "./Python3Parser";
import { Signed_real_numberContext } from "./Python3Parser";
import { Real_numberContext } from "./Python3Parser";
import { Imaginary_numberContext } from "./Python3Parser";
import { Capture_patternContext } from "./Python3Parser";
import { Pattern_capture_targetContext } from "./Python3Parser";
import { Wildcard_patternContext } from "./Python3Parser";
import { Value_patternContext } from "./Python3Parser";
import { AttrContext } from "./Python3Parser";
import { Name_or_attrContext } from "./Python3Parser";
import { Group_patternContext } from "./Python3Parser";
import { Sequence_patternContext } from "./Python3Parser";
import { Open_sequence_patternContext } from "./Python3Parser";
import { Maybe_sequence_patternContext } from "./Python3Parser";
import { Maybe_star_patternContext } from "./Python3Parser";
import { Star_patternContext } from "./Python3Parser";
import { Mapping_patternContext } from "./Python3Parser";
import { Items_patternContext } from "./Python3Parser";
import { Key_value_patternContext } from "./Python3Parser";
import { Double_star_patternContext } from "./Python3Parser";
import { Class_patternContext } from "./Python3Parser";
import { Positional_patternsContext } from "./Python3Parser";
import { Keyword_patternsContext } from "./Python3Parser";
import { Keyword_patternContext } from "./Python3Parser";
import { TestContext } from "./Python3Parser";
import { Test_nocondContext } from "./Python3Parser";
import { LambdefContext } from "./Python3Parser";
import { Lambdef_nocondContext } from "./Python3Parser";
import { Or_testContext } from "./Python3Parser";
import { And_testContext } from "./Python3Parser";
import { Not_testContext } from "./Python3Parser";
import { ComparisonContext } from "./Python3Parser";
import { Comp_opContext } from "./Python3Parser";
import { Star_exprContext } from "./Python3Parser";
import { ExprContext } from "./Python3Parser";
import { Xor_exprContext } from "./Python3Parser";
import { And_exprContext } from "./Python3Parser";
import { Shift_exprContext } from "./Python3Parser";
import { Arith_exprContext } from "./Python3Parser";
import { TermContext } from "./Python3Parser";
import { FactorContext } from "./Python3Parser";
import { PowerContext } from "./Python3Parser";
import { Atom_exprContext } from "./Python3Parser";
import { AtomContext } from "./Python3Parser";
import { NameContext } from "./Python3Parser";
import { Testlist_compContext } from "./Python3Parser";
import { TrailerContext } from "./Python3Parser";
import { SubscriptlistContext } from "./Python3Parser";
import { Subscript_Context } from "./Python3Parser";
import { SliceopContext } from "./Python3Parser";
import { ExprlistContext } from "./Python3Parser";
import { TestlistContext } from "./Python3Parser";
import { DictorsetmakerContext } from "./Python3Parser";
import { ClassdefContext } from "./Python3Parser";
import { ArglistContext } from "./Python3Parser";
import { ArgumentContext } from "./Python3Parser";
import { Comp_iterContext } from "./Python3Parser";
import { Comp_forContext } from "./Python3Parser";
import { Comp_ifContext } from "./Python3Parser";
import { Encoding_declContext } from "./Python3Parser";
import { Yield_exprContext } from "./Python3Parser";
import { Yield_argContext } from "./Python3Parser";
import { StringsContext } from "./Python3Parser";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `Python3Parser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface Python3ParserVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `Python3Parser.single_input`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSingle_input?: (ctx: Single_inputContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.file_input`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFile_input?: (ctx: File_inputContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.eval_input`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEval_input?: (ctx: Eval_inputContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.decorator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDecorator?: (ctx: DecoratorContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.decorators`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDecorators?: (ctx: DecoratorsContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.decorated`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDecorated?: (ctx: DecoratedContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.async_funcdef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAsync_funcdef?: (ctx: Async_funcdefContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.funcdef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFuncdef?: (ctx: FuncdefContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.parameters`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParameters?: (ctx: ParametersContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.typedargslist`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypedargslist?: (ctx: TypedargslistContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.tfpdef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTfpdef?: (ctx: TfpdefContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.varargslist`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVarargslist?: (ctx: VarargslistContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.vfpdef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVfpdef?: (ctx: VfpdefContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStmt?: (ctx: StmtContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.simple_stmts`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSimple_stmts?: (ctx: Simple_stmtsContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.simple_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSimple_stmt?: (ctx: Simple_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.expr_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpr_stmt?: (ctx: Expr_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.annassign`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAnnassign?: (ctx: AnnassignContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.testlist_star_expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTestlist_star_expr?: (ctx: Testlist_star_exprContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.augassign`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAugassign?: (ctx: AugassignContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.del_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDel_stmt?: (ctx: Del_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.pass_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPass_stmt?: (ctx: Pass_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.flow_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFlow_stmt?: (ctx: Flow_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.break_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBreak_stmt?: (ctx: Break_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.continue_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitContinue_stmt?: (ctx: Continue_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.return_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitReturn_stmt?: (ctx: Return_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.yield_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitYield_stmt?: (ctx: Yield_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.raise_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRaise_stmt?: (ctx: Raise_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.import_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitImport_stmt?: (ctx: Import_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.import_name`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitImport_name?: (ctx: Import_nameContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.import_from`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitImport_from?: (ctx: Import_fromContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.import_as_name`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitImport_as_name?: (ctx: Import_as_nameContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.dotted_as_name`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDotted_as_name?: (ctx: Dotted_as_nameContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.import_as_names`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitImport_as_names?: (ctx: Import_as_namesContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.dotted_as_names`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDotted_as_names?: (ctx: Dotted_as_namesContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.dotted_name`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDotted_name?: (ctx: Dotted_nameContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.global_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGlobal_stmt?: (ctx: Global_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.nonlocal_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNonlocal_stmt?: (ctx: Nonlocal_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.assert_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAssert_stmt?: (ctx: Assert_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.compound_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCompound_stmt?: (ctx: Compound_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.async_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAsync_stmt?: (ctx: Async_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.if_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIf_stmt?: (ctx: If_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.while_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitWhile_stmt?: (ctx: While_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.for_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFor_stmt?: (ctx: For_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.try_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTry_stmt?: (ctx: Try_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.with_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitWith_stmt?: (ctx: With_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.with_item`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitWith_item?: (ctx: With_itemContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.except_clause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExcept_clause?: (ctx: Except_clauseContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.block`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBlock?: (ctx: BlockContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.match_stmt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMatch_stmt?: (ctx: Match_stmtContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.subject_expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSubject_expr?: (ctx: Subject_exprContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.star_named_expressions`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStar_named_expressions?: (ctx: Star_named_expressionsContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.star_named_expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStar_named_expression?: (ctx: Star_named_expressionContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.case_block`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCase_block?: (ctx: Case_blockContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.guard`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGuard?: (ctx: GuardContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.patterns`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPatterns?: (ctx: PatternsContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.pattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPattern?: (ctx: PatternContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.as_pattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAs_pattern?: (ctx: As_patternContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.or_pattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOr_pattern?: (ctx: Or_patternContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.closed_pattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClosed_pattern?: (ctx: Closed_patternContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.literal_pattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLiteral_pattern?: (ctx: Literal_patternContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.literal_expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLiteral_expr?: (ctx: Literal_exprContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.complex_number`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitComplex_number?: (ctx: Complex_numberContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.signed_number`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSigned_number?: (ctx: Signed_numberContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.signed_real_number`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSigned_real_number?: (ctx: Signed_real_numberContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.real_number`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitReal_number?: (ctx: Real_numberContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.imaginary_number`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitImaginary_number?: (ctx: Imaginary_numberContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.capture_pattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCapture_pattern?: (ctx: Capture_patternContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.pattern_capture_target`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPattern_capture_target?: (ctx: Pattern_capture_targetContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.wildcard_pattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitWildcard_pattern?: (ctx: Wildcard_patternContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.value_pattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitValue_pattern?: (ctx: Value_patternContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.attr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAttr?: (ctx: AttrContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.name_or_attr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitName_or_attr?: (ctx: Name_or_attrContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.group_pattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGroup_pattern?: (ctx: Group_patternContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.sequence_pattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSequence_pattern?: (ctx: Sequence_patternContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.open_sequence_pattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOpen_sequence_pattern?: (ctx: Open_sequence_patternContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.maybe_sequence_pattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMaybe_sequence_pattern?: (ctx: Maybe_sequence_patternContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.maybe_star_pattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMaybe_star_pattern?: (ctx: Maybe_star_patternContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.star_pattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStar_pattern?: (ctx: Star_patternContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.mapping_pattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMapping_pattern?: (ctx: Mapping_patternContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.items_pattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitItems_pattern?: (ctx: Items_patternContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.key_value_pattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitKey_value_pattern?: (ctx: Key_value_patternContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.double_star_pattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDouble_star_pattern?: (ctx: Double_star_patternContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.class_pattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClass_pattern?: (ctx: Class_patternContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.positional_patterns`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPositional_patterns?: (ctx: Positional_patternsContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.keyword_patterns`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitKeyword_patterns?: (ctx: Keyword_patternsContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.keyword_pattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitKeyword_pattern?: (ctx: Keyword_patternContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.test`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTest?: (ctx: TestContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.test_nocond`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTest_nocond?: (ctx: Test_nocondContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.lambdef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLambdef?: (ctx: LambdefContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.lambdef_nocond`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLambdef_nocond?: (ctx: Lambdef_nocondContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.or_test`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOr_test?: (ctx: Or_testContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.and_test`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAnd_test?: (ctx: And_testContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.not_test`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNot_test?: (ctx: Not_testContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.comparison`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitComparison?: (ctx: ComparisonContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.comp_op`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitComp_op?: (ctx: Comp_opContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.star_expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStar_expr?: (ctx: Star_exprContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpr?: (ctx: ExprContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.xor_expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitXor_expr?: (ctx: Xor_exprContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.and_expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAnd_expr?: (ctx: And_exprContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.shift_expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitShift_expr?: (ctx: Shift_exprContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.arith_expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArith_expr?: (ctx: Arith_exprContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.term`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTerm?: (ctx: TermContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.factor`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFactor?: (ctx: FactorContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.power`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPower?: (ctx: PowerContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.atom_expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAtom_expr?: (ctx: Atom_exprContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.atom`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAtom?: (ctx: AtomContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.name`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitName?: (ctx: NameContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.testlist_comp`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTestlist_comp?: (ctx: Testlist_compContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.trailer`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTrailer?: (ctx: TrailerContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.subscriptlist`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSubscriptlist?: (ctx: SubscriptlistContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.subscript_`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSubscript_?: (ctx: Subscript_Context) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.sliceop`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSliceop?: (ctx: SliceopContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.exprlist`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExprlist?: (ctx: ExprlistContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.testlist`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTestlist?: (ctx: TestlistContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.dictorsetmaker`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDictorsetmaker?: (ctx: DictorsetmakerContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.classdef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassdef?: (ctx: ClassdefContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.arglist`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArglist?: (ctx: ArglistContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.argument`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArgument?: (ctx: ArgumentContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.comp_iter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitComp_iter?: (ctx: Comp_iterContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.comp_for`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitComp_for?: (ctx: Comp_forContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.comp_if`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitComp_if?: (ctx: Comp_ifContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.encoding_decl`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEncoding_decl?: (ctx: Encoding_declContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.yield_expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitYield_expr?: (ctx: Yield_exprContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.yield_arg`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitYield_arg?: (ctx: Yield_argContext) => Result;

	/**
	 * Visit a parse tree produced by `Python3Parser.strings`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStrings?: (ctx: StringsContext) => Result;
}

